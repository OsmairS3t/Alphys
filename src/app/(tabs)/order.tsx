import { useState, useEffect, useCallback } from 'react';
import { Modal, FlatList, Pressable, Alert, View, Text } from 'react-native';
import { useTheme } from 'styled-components';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FilterStock from '../components/Filter/filterstock';

import { keyClient, keyOrder, keyProduct, keySale, keyStock } from '../../utils/keyStorage';
import { IClient, IOrder, IProduct, ISale, ISelectProps, IStock } from '../../utils/interface';

import { ButtonFilterScreenPage, ButtonForm, 
  ButtonNewScreenPage, 
  Container, 
  HeaderScreenPage, 
  IconButtonNewScreenPage, 
  IconFilterScreenPage, 
  InputMask, 
  TextButton } from '../styles/global'
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
} from '../styles/orderStyle'
import HeaderModal from '../components/HeaderModal';
import RegisterOrder from '../screens/regOrder';
import { GroupColumn, GroupIconTextRow, ItemColumnList, TextColumnList } from '../styles/registerStyle';
import { InputForm } from '../components/Forms/InputForm';
import FilterOrder from '../components/Filter/filterorder';

export default function Order() {
  const theme = useTheme()
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [filterOrderType, setFilterOrderType] = useState('')
  const [filterOrderId, setFilterOrderId] = useState('')
  const [orders, setOrders] = useState<IOrder[]>([]);
 
  async function loadOrders(typeFilter: string, idfilter: string) {
    try {
      const response = await AsyncStorage.getItem(keyOrder)
      const arrayOrders: IOrder[] = response ? JSON.parse(response) : []
      if (typeFilter === '') {
        setOrders(arrayOrders)
      }
      if (typeFilter === 'idclient') {
        const arrayClient = arrayOrders.filter(arrOrder => arrOrder.client?.id === idfilter)
        setOrders(arrayClient)
      }
      if (typeFilter === 'idproduct') {
        const arrayProduct = arrayOrders.filter(arrOrder => arrOrder.product?.id === idfilter)
        setOrders(arrayProduct)
      }
    } catch (e) {
      console.log(e)
    }
  }

  function handleFilterModalOpen() {
    setIsFilterModalOpen(true)
  }

  function handleNewBuyModalOpen() {
    setIsNewModalOpen(true)
  }

  useEffect(() => {
    loadOrders(filterOrderType, filterOrderId)
  }, [filterOrderType, filterOrderId])

  return (
    <Container>
      <Title>Encomendas de produtos:</Title>
      <HeaderScreenPage>
        <ButtonFilterScreenPage onPress={handleFilterModalOpen}>
          <IconFilterScreenPage name='sliders' size={24} />
        </ButtonFilterScreenPage>
        <ButtonNewScreenPage onPress={handleNewBuyModalOpen}>
          <IconButtonNewScreenPage name='plus' size={24} />
        </ButtonNewScreenPage>
      </HeaderScreenPage>

      <GroupColumn>
        {orders.length > 0 ?
          <FlatList
            style={{ height: 450 }}
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <Pressable onPress={() => { }}>
                <ItemColumnList>
                  <TextColumnList>Cliente: {item.client?.name}</TextColumnList>
                  <TextColumnList>Produto: {item.product?.category?.name} - {item.product?.name}</TextColumnList>
                  <TextColumnList>Qunatidade: {item.amount}</TextColumnList>
                  <TextColumnList>Valor: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(item.price)}</TextColumnList>
                </ItemColumnList>
              </Pressable>
            }
          />
          :
          <TextColumnList>Não há encomendas de produtos cadastradas.</TextColumnList>
        }
      </GroupColumn>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isNewModalOpen}
        onRequestClose={() => {
          setIsNewModalOpen(!isNewModalOpen)
        }}>
        <RegisterOrder closeModal={setIsNewModalOpen} />
      </Modal>

      <Modal
        transparent={true}
        animationType='fade'
        visible={isFilterModalOpen}
        onRequestClose={() => {
          setIsFilterModalOpen(!isFilterModalOpen)
        }}>
        <FilterOrder 
          closeModal={setIsFilterModalOpen} 
          setFilterType={setFilterOrderType} 
          setFilterId={setFilterOrderId} 
        />
      </Modal>
      

    </Container>
  )
}