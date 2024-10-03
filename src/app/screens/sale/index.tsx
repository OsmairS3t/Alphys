import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';
import HeaderModal from '../../components/HeaderModal';

import { IClient, IProduct, IStock, ITransaction } from '../../../utils/interface';
import { keySale, keyStock } from '../../../utils/keyStorage';
import RegisterSale from './regSale';

import {
  HeaderScreenPage,
  ButtonNewScreenPage,
  IconButtonNewScreenPage,
  IconFilterScreenPage
} from '../../styles/global';
import {
  ContainerModal,
  GroupColumn,
  GroupIconTextRow,
  TextColumnList,
  IconColumnList,
  IconColumnListMaterial
} from '../../styles/registerStyle';
import FilterSale from '../../components/Filter/filtersale';
import { useTransactionDatabase } from '../../../hooks/useTransactionDatabase';
import { useStockDatabase } from '../../../hooks/useStockDatabase';

type SaleProps = {
  closeModal: (value: boolean) => void;
}

export default function Sale({ closeModal }: SaleProps) {
  const theme = useTheme()
  const transactionDatabase = useTransactionDatabase()
  const stockDatabase = useStockDatabase()
  const [statusPay, setStatusPay] = useState(false)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [sales, setSales] = useState<ITransaction[]>([]);
  const [sale, setSale] = useState<ITransaction>()
  const [tot, setTot] = useState(0)

  async function loadSales(status: boolean) {
    try {
      const response = await transactionDatabase.searchByModality('sale')
      if(response) {
        const filterSales = response.filter(as => as.ispaid === status)
        let tot = 0
        filterSales.map(s => {
          tot += s.price
        })
        setTot(tot)
        setSales(filterSales)
      }
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewSaleModalOpen() {
    setSale(undefined)
    setIsNewModalOpen(true)
  }

  function handleFilterSaleModalOpen() {
    setIsFilterModalOpen(true)
  }

  function handleEditSaleModalOpen(item: ITransaction) {
    setSale(item)
    setIsNewModalOpen(true)
  }

  async function deleteSale(id: number) {
    try {
      //localiza o produto na venda e pega quantidade
      const responseSale = await transactionDatabase.searchById(id)
      const amountSaled = responseSale?.amount

      //localiza produto no estoque e pega quantidade
      const responseStock = await stockDatabase.searchById(Number(responseSale?.stock_id))
      const amountStock = responseStock?.amount

      //salva novo estoque
      await stockDatabase.update({
        id: Number(responseSale?.stock_id),
        product_id: Number(responseStock?.product_id),
        product_name: String(responseStock?.product_name),
        amount: Number(amountSaled) + Number(amountStock),
        hasstock: (Number(amountSaled) + Number(amountStock)) > 0 ? true : false,
      })

      //exlui a venda
      await transactionDatabase.remove(id)
      Alert.alert('Venda excluída com sucesso!')
      loadSales(statusPay)
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  async function paySale(id: number) {
    const foundSale = await transactionDatabase.searchById(id)
    await transactionDatabase.update({
      id: Number(foundSale?.id),
      modality: 'sale',
      kind: String(foundSale?.kind),
      place: String(foundSale?.place),
      product_name: String(foundSale?.product_name),
      client_name: String(foundSale?.client_name),
      amount: Number(foundSale?.amount),
      price: Number(foundSale?.price),
      datetransaction: String(foundSale?.datetransaction),
      ispaid: true,
      stock_id: Number(foundSale?.stock_id),
    })
    await loadSales(statusPay)
  }

  function handlePaySale(id: number) {
    Alert.alert(
      'Confirmação de pagamento',
      'Tem certeza que deseja alterar este pagamento?',
      [
        {
          text: 'Sim',
          onPress: () => {
            paySale(id)
          },
          style: 'default',
        },
        {
          text: 'Não',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  }

  function handleDeleteSale(id: number) {
    Alert.alert(
      'Exclusao de Venda',
      'Tem certeza que deseja excluir esta venda?',
      [
        {
          text: 'Sim',
          onPress: () => {
            deleteSale(id)
          },
          style: 'default',
        },
        {
          text: 'Não',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  }

  useEffect(() => {
    loadSales(statusPay)
  }, [statusPay])

  return (
    <ContainerModal>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE VENDAS' />

      <HeaderScreenPage>
        <ButtonNewScreenPage onPress={handleFilterSaleModalOpen}>
          <IconFilterScreenPage color={theme.colors.primary} name='sliders' size={24} />
        </ButtonNewScreenPage>
        <ButtonNewScreenPage onPress={handleNewSaleModalOpen}>
          <IconButtonNewScreenPage name='plus' size={24} />
        </ButtonNewScreenPage>
      </HeaderScreenPage>

      <GroupColumn>
        {sales.length > 0 ?
          <>
            <FlatList
              style={{ height: 430 }}
              data={sales}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) =>
                <GroupIconTextRow>
                  <Pressable onPress={() => handlePaySale(item.id)}>
                    <TextColumnList>
                      {item.ispaid ?
                        <IconColumnListMaterial isPaid={item.ispaid} name='attach-money' size={18} /> :
                        <IconColumnListMaterial isPaid={item.ispaid} name='money-off' size={18} />
                      }
                    </TextColumnList>
                  </Pressable>

                  <Pressable
                    onPress={() => handleEditSaleModalOpen(item)}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}
                  >
                    <TextColumnList>
                      {item.client_name}
                    </TextColumnList>
                    <TextColumnList>
                      {Intl
                        .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                        .format(item.price)}
                    </TextColumnList>
                  </Pressable>


                  <Pressable onPress={() => handleDeleteSale(item.id)}>
                    <IconColumnList name='trash-2' size={20} />
                  </Pressable>
                </GroupIconTextRow>
              }
            />
            <TextColumnList align='right'>
              Total: {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tot)}
            </TextColumnList>
          </>
          :
          <TextColumnList>Não há vendas {statusPay ? 'pagas' : 'a pagar'} para exibir.</TextColumnList>
        }
      </GroupColumn>

      <Modal
        transparent={true}
        animationType='fade'
        visible={isNewModalOpen}
        onRequestClose={() => {
          setIsNewModalOpen(!isNewModalOpen)
        }}>
        <RegisterSale
          closeModal={setIsNewModalOpen}
          updateList={() => loadSales(statusPay)}
          sale={sale}
        />
      </Modal>

      <Modal
        transparent={true}
        animationType='fade'
        visible={isFilterModalOpen}
        onRequestClose={() => {
          setIsFilterModalOpen(!isFilterModalOpen)
        }}>
        <FilterSale
          closeModal={setIsFilterModalOpen}
          setStatusPay={setStatusPay}
          status={statusPay}
        />
      </Modal>

    </ContainerModal>
  )
}
