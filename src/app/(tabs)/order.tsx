import { useState, useEffect, useCallback } from 'react';
import { Modal, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StockProducts from '../screens/regStock';
import FilterStock from '../screens/filterstock';

import { keySale, keyStock } from '../../utils/keyStorage';
import { ISale, IStock } from '../../utils/interface';

import { Container } from '../styles/global'
import {
  Title,
  GroupSale,
  ItemSale,
  ClientReceipt,
  ProductReceipt,
  PriceReceipt,
  TextSale,
  QtdSale,
  StatusSale,
  IconSale,
  BtnSituation,
  TextBtnSituation,
  Separator
} from '../styles/receiptStyle'

export default function Order() {
  const [sales, setSales] = useState<ISale[]>([])
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // async function loadSales() {
  //   try {
  //     const response = await AsyncStorage.getItem(keySale)
  //     const arraySales: ISale[] = response ? JSON.parse(response) : []
  //     setSales(arraySales)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  // useEffect(() => {
  //   loadSales()
  // }, [])

  return (
    <Container>
      <Title>Encomendas de produtos:</Title>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isDetailModalOpen}
        onRequestClose={() => {
          setIsDetailModalOpen(!isDetailModalOpen)
        }}>
        <FilterStock closeModal={setIsDetailModalOpen} />
      </Modal>

    </Container>
  )
}