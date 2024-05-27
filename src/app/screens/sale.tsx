import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';
import HeaderModal from '../components/HeaderModal';

import { IClient, IProduct, ISale, IStock } from '../../utils/interface';
import { keySale, keyStock } from '../../utils/keyStorage';
import RegisterSale from './regSale';

import {
  HeaderScreenPage,
  ButtonNewScreenPage,
  IconButtonNewScreenPage,
  IconFilterScreenPage
} from '../styles/global';
import {
  ContainerModal,
  GroupColumn,
  GroupIconTextRow,
  TextColumnList,
  IconColumnList,
  IconColumnListMaterial
} from '../styles/registerStyle';
import FilterSale from '../components/Filter/filtersale';

type SaleProps = {
  closeModal: (value: boolean) => void;
}

export default function Sale({ closeModal }: SaleProps) {
  const theme = useTheme()
  const [statusPay, setStatusPay] = useState(false)
  const [idSale, setIdSale] = useState('')
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [sales, setSales] = useState<ISale[]>([]);
  const [tot, setTot] = useState(0)

  async function loadSales(status: boolean) {
    try {
      const response = await AsyncStorage.getItem(keySale)
      const arraySales: ISale[] = response ? JSON.parse(response) : []
      const filterSales = arraySales.filter(as => as.isPaid === status)
      let tot = 0
      filterSales.map(s => {
        tot += s.price
      })
      setTot(tot)
      setSales(filterSales)
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewSaleModalOpen() {
    setIdSale('')
    setIsNewModalOpen(true)
  }

  function handleFilterSaleModalOpen() {
    setIsFilterModalOpen(true)
  }

  function handleEditSaleModalOpen(id: string) {
    setIdSale(id)
    setIsNewModalOpen(true)
  }

  async function deleteSale(id: string) {
    try {
      //localiza o produto na venda e pega quantidade
      const responseSale = await AsyncStorage.getItem(keySale)
      const sales: ISale[] = responseSale ? JSON.parse(responseSale) : []
      const foundProductSale = sales.find(sale => sale.id === id)
      const amountSaled = foundProductSale?.amount

      //localiza produto no estoque e pega quantidade
      const responseStock = await AsyncStorage.getItem(keyStock)
      const stocks: IStock[] = responseStock ? JSON.parse(responseStock) : []
      const foundProductStock = stocks.find(stock => stock.product?.id === foundProductSale?.product?.id)
      const amountStock = foundProductStock?.amount

      //separa os demais para remover o produto a ser exluido do estoque
      const removeSale = sales.filter(sale => sale.id !== id)

      //salva novo estoque
      const dataNewStock = {
        id: String(foundProductStock?.id),
        product: foundProductStock?.product,
        amount: Number(amountSaled) + Number(amountStock),
        hasStock: (Number(amountSaled) + Number(amountStock)) > 0 ? true : false,
      }
      // remove o item com estoque antigo do estoque e atualiza com o novo estoque
      let updateStock = stocks.filter(stock => stock.id !== foundProductStock?.id)
      updateStock.push(dataNewStock)
      await AsyncStorage.setItem(keyStock, JSON.stringify(updateStock))

      await AsyncStorage.setItem(keySale, JSON.stringify(removeSale))
      Alert.alert('Venda excluída com sucesso!')
      loadSales(statusPay)
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  async function paySale(id: string) {
    const responseSale = await AsyncStorage.getItem(keySale)
    const sales: ISale[] = responseSale ? JSON.parse(responseSale) : []
    const foundSale = sales.find(sale => sale.id === id)
    const isPaidModified = Boolean(foundSale?.isPaid)
    const dataNewSale = {
      id: String(foundSale?.id),
      client: foundSale?.client,
      product: foundSale?.product,
      amount: Number(foundSale?.amount),
      price: Number(foundSale?.price),
      isPaid: !isPaidModified,
      dateSale: String(foundSale?.dateSale),
    }
    let updateSale = sales.filter(sale => sale.id !== id)
    updateSale.push(dataNewSale)
    await AsyncStorage.setItem(keySale, JSON.stringify(updateSale))
    await loadSales(statusPay)
  }

  function handlePaySale(id: string) {
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

  function handleDeleteSale(id: string) {
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
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                <GroupIconTextRow>
                  <Pressable onPress={() => handlePaySale(item.id)}>
                    <TextColumnList>
                      {item.isPaid ?
                        <IconColumnListMaterial isPaid={item.isPaid} name='attach-money' size={18} /> :
                        <IconColumnListMaterial isPaid={item.isPaid} name='money-off' size={18} />
                      }
                    </TextColumnList>
                  </Pressable>

                  <Pressable
                    onPress={() => handleEditSaleModalOpen(item.id)}
                    style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%' }}
                  >
                    <TextColumnList>
                      {item.client?.name}
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
          idSale={idSale}
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
