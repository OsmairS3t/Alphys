import { useState, useEffect, useCallback } from 'react';
import { Modal, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StockProducts from '../screens/stockproducts';
import FilterStock from '../screens/filterstock';

import { keyStock } from '../../utils/keyStorage';
import { IStock } from '../../utils/interface';
//import { stocks } from '../../utils/database';

import { Container } from '../styles/global'
import {
  HeaderStock,
  ButtonFilterStock,
  IconFilterStock,
  ButtonNewStock,
  IconButtonNewStock,
  Title,
  GroupStock,
  ItemStock,
  LineStock,
  TextStock,
  QtdStock,
  StatusStock,
  IconStock,
  Separator
} from '../styles/stockStyle'

export default function Stock() {
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
    <Container>
      <Title>Estoque de produtos:</Title>
      <HeaderStock>
        <ButtonFilterStock onPress={handleFilterModalOpen}>
          <IconFilterStock name='sliders' size={24} />
        </ButtonFilterStock>
        <ButtonNewStock onPress={handleNewStockModalOpen}>
          <IconButtonNewStock name='plus' size={24} />
        </ButtonNewStock>
      </HeaderStock>

      <GroupStock>
        {stocks.length > 0 ?
          <FlatList
            data={stocks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <ItemStock>
                <Pressable onPress={() => handleEditStockModalOpen(item.id)}>
                  <LineStock>
                    <TextStock>{item.product?.category?.name} - {item.product?.name}</TextStock>
                    <QtdStock>{item.amount} itens</QtdStock>
                    <StatusStock>
                      {item.hasStock ?
                        <IconStock name='thumbs-up' size={20} accessibilityHint='Disponivel' /> :
                        <IconStock name='thumbs-down' size={20} accessibilityHint='Indisponivel' />
                      }
                    </StatusStock>
                  </LineStock>
                </Pressable>
                <Separator />
              </ItemStock>
            }
          />
          :
          <TextStock>Não há produtos cadastrados no estoque</TextStock>
        }
      </GroupStock>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isFilterModalOpen}
        onRequestClose={() => {
          setIsFilterModalOpen(!isFilterModalOpen)
        }}>
        <FilterStock closeModal={setIsFilterModalOpen} />
      </Modal>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isStockModalOpen}
        onRequestClose={() => {
          setIsStockModalOpen(!isStockModalOpen)
        }}>
        <StockProducts closeModal={setIsStockModalOpen} idStock={idStock} />
      </Modal>
    </Container>
  )
}