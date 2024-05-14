import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderModal from '../components/HeaderModal';

import { ISale, IStock } from '../../utils/interface';
import { keySale, keyStock } from '../../utils/keyStorage';
import RegisterSale from './regSale';

import {
  HeaderScreenPage,
  ButtonNewScreenPage,
  IconButtonNewScreenPage
} from '../styles/global';
import {
  ContainerModal,
  GroupColumn,
  GroupIconTextRow,
  ItemColumnList,
  TextColumnList,
  IconColumnList
} from '../styles/registerStyle';

type SaleProps = {
  closeModal: (value: boolean) => void;
}

export default function Sale({ closeModal }: SaleProps) {
  const [idSale, setIdSale] = useState('')
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [sales, setSales] = useState<ISale[]>([]);
  const [tot, setTot] = useState(0)

  async function loadSales() {
    try {
      const response = await AsyncStorage.getItem(keySale)
      const sale: ISale[] = response ? JSON.parse(response) : []
      let tot = 0
      sale.map(s => {
        tot += s.price
      })
      setTot(tot)
      setSales(sale)
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewSaleModalOpen() {
    setIdSale('')
    setIsNewModalOpen(true)
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
      loadSales()
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
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
    loadSales()
  }, [])

  return (
    <ContainerModal>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE VENDAS' />

      <HeaderScreenPage>
        <ButtonNewScreenPage onPress={handleNewSaleModalOpen}>
          <IconButtonNewScreenPage name='plus' size={24} />
        </ButtonNewScreenPage>
      </HeaderScreenPage>

      <GroupColumn>
        {sales.length > 0 ?
          <>
          <FlatList
            style={{ height: 300 }}
            data={sales}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <GroupIconTextRow>
                <Pressable onPress={() => handleEditSaleModalOpen(item.id)}>
                  <ItemColumnList>
                    <TextColumnList>
                      {item.isPaid ? <IconColumnList name='dollar-sign' size={18} /> : 'A pagar'} - 
                      {item.client?.name} - {Intl
                          .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                          .format(item.price)} 
                    </TextColumnList>
                  </ItemColumnList>
                </Pressable>

                <Pressable onPress={() => handleDeleteSale(item.id)}>
                  <IconColumnList name='trash-2' size={20} />
                </Pressable>
              </GroupIconTextRow>
            }
          />
          <TextColumnList>Total: {tot}</TextColumnList>
          </>
          :
          <TextColumnList>Não há produtos cadastrados no estoque</TextColumnList>
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
          updateList={loadSales}
          idSale={idSale}
        />
      </Modal>

    </ContainerModal>
  )
}
