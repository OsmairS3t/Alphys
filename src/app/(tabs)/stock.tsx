import { useState, useEffect, useCallback } from 'react';
import { Modal, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';

import StockProducts from '../screens/stockproducts';
import FilterStock from '../screens/filterstock';
//import { stocks } from '../../utils/database'

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyStock } from '../../utils/keyStorage';
import { IStock } from '../../utils/interface';

export default function Stock() {
  const [stocks, setStocks] = useState<IStock[]>([])
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)
  const [codPro, setCodPro] = useState('')
  const [amountPro, setAmountPro] = useState('')

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

  function handleStockModalOpen(codpro: string, amountpro: string) {
    setCodPro(codpro)
    setAmountPro(amountpro)
    setIsStockModalOpen(true)
  }

  useFocusEffect(
    useCallback(() => {
      loadStock()
    }, [])
  )

  // useEffect(() => {
  //   loadStock()
  // }, [])

  return (
    <Container>
      <Title>Estoque de produtos:</Title>
      <HeaderStock>
        <ButtonFilterStock onPress={handleFilterModalOpen}>
          <IconFilterStock name='sliders' size={24} />
        </ButtonFilterStock>
        <ButtonNewStock onPress={() => handleStockModalOpen('', '')}>
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
                <Pressable onPress={() => handleStockModalOpen(item.codproduct, item.amount.toString())}>
                  <LineStock>
                    <TextStock>{item.product}</TextStock>
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
          <TextStock>Não há compras ou vendas no momento</TextStock>
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
        <StockProducts closeModal={setIsStockModalOpen} codprod={codPro} amountprod={amountPro} />
      </Modal>
    </Container>
  )
}