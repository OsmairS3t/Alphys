import { useState, useEffect, useCallback } from 'react';
import { Modal, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RegisterStock from './regStock';
import FilterStock from '../components/Filter/filterstock';

import { keyStock } from '../../utils/keyStorage';
import { IStock } from '../../utils/interface';

import {
  ContainerModal,
  GroupColumn,
  ItemColumnList,
  GroupIconTextRow,
  IconColumnList,
  TextColumnList
} from '../styles/registerStyle';
import {
  HeaderStock,
  ButtonFilterStock,
  IconFilterStock,
  ButtonNewStock,
  IconButtonNewStock
} from '../styles/stockStyle'
import HeaderModal from '../components/HeaderModal';

type StockProps = {
  closeModal: (value: boolean) => void;
}

export default function Stock({ closeModal }: StockProps) {
  const [stocks, setStocks] = useState<IStock[]>([])
  const [stock, setStock] = useState<IStock>()
  const [idStock, setIdStock] = useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)

  async function loadStock() {
    try {
      const result = await AsyncStorage.getItem(keyStock)
      const stock: IStock[] = result !== null ? JSON.parse(result) : []
      setStocks(stock)
    } catch (e) {
      console.log(e)
    }
  }

  function handleFilterModalOpen() {
    setIsFilterModalOpen(true)
  }

  function handleNewStockModalOpen() {
    setIdStock('')
    setIsStockModalOpen(true)
  }

  function handleEditStockModalOpen(id: string) {
    setIdStock(id)
    setIsStockModalOpen(true)
  }

  useFocusEffect(
    useCallback(() => {
      loadStock()
    }, [])
  )

  return (
    <ContainerModal>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='ESTOQUE DE PRODUTOS' />
      <HeaderStock>
        <ButtonFilterStock onPress={handleFilterModalOpen}>
          <IconFilterStock name='sliders' size={24} />
        </ButtonFilterStock>
        <ButtonNewStock onPress={handleNewStockModalOpen}>
          <IconButtonNewStock name='plus' size={24} />
        </ButtonNewStock>
      </HeaderStock>

      <GroupColumn>
        {stocks.length > 0 ?
          <FlatList
            style={{ height: 450 }}
            data={stocks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <Pressable onPress={() => handleEditStockModalOpen(item.id)}>
                <ItemColumnList>
                  <GroupIconTextRow>
                    <TextColumnList>{item.product?.category?.name} - {item.product?.name}</TextColumnList>
                    <TextColumnList>{item.amount} itens</TextColumnList>
                  </GroupIconTextRow>
                </ItemColumnList>
              </Pressable>
            }
          />
          :
          <TextColumnList>Não há produtos cadastrados no estoque</TextColumnList>
        }
      </GroupColumn>

      <Modal
        transparent={true}
        animationType='fade'
        visible={isFilterModalOpen}
        onRequestClose={() => {
          setIsFilterModalOpen(!isFilterModalOpen)
        }}>
        <FilterStock closeModal={setIsFilterModalOpen} />
      </Modal>

      <Modal
        transparent={true}
        animationType='fade'
        visible={isStockModalOpen}
        onRequestClose={() => {
          setIsStockModalOpen(!isStockModalOpen)
        }}>
        <RegisterStock closeModal={setIsStockModalOpen} idStock={idStock} />
      </Modal>
    </ContainerModal>
  )
}