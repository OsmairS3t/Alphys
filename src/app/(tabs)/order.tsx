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
  TitleModal, 
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
import RegisterOrder from '../screens/order/regOrder';

import { GroupColumn, 
  GroupIconTextRow, 
  IconColumnList, 
  ItemColumnList, 
  TextColumnList } from '../styles/registerStyle';
import FilterOrder from '../components/Filter/filterorder';

interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
  photo: string;
}

export default function Order() {
  const theme = useTheme()
  const [idOrder, setIdOrder] = useState('')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [filterOrderType, setFilterOrderType] = useState('')
  const [filterOrderId, setFilterOrderId] = useState('')
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [users, setUsers] = useState<IUser[]>([])
 
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
    setIdOrder('')
    setIsNewModalOpen(true)
  }

  function handleEditBuyModalOpen(id: string) {
    setIdOrder(id)
    setIsNewModalOpen(true)
  }

  async function deleteOrder(id: string) {
    try {
      const responseOrder = await AsyncStorage.getItem(keyOrder)
      const orders: IOrder[] = responseOrder ? JSON.parse(responseOrder) : []
      const removedItem = orders.filter(order => order.id !== id)
      await AsyncStorage.setItem(keyOrder, JSON.stringify(removedItem))
      loadOrders(filterOrderType, filterOrderId)
      Alert.alert('Encomenda excluída com sucesso!')
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  function handleDeleteOrder(id: string) {
    Alert.alert(
      'Exclusao de Encomendas',
      'Tem certeza que deseja excluir esta encomenda?',
      [
        {
          text: 'Sim',
          onPress: () => {
            deleteOrder(id)
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
    loadOrders(filterOrderType, filterOrderId)
  }, [filterOrderType, filterOrderId])

  return (
    <Container>
      <TitleModal>ENCOMENDAS DE PRODUTOS:</TitleModal>
      <HeaderScreenPage>
        <ButtonFilterScreenPage onPress={handleFilterModalOpen}>
          <IconFilterScreenPage color={theme.colors.secondary} name='sliders' size={24} />
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
              <GroupIconTextRow>
                <Pressable onPress={() => handleEditBuyModalOpen(item.id)}>
                  <ItemColumnList>
                    <TextColumnList>Cliente: {item.client?.name}</TextColumnList>
                    <TextColumnList>Produto: {item.product?.category?.name} - {item.product?.name}</TextColumnList>
                    <TextColumnList>Qunatidade: {item.amount}</TextColumnList>
                    <TextColumnList>Valor: {Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(item.price)}</TextColumnList>
                  </ItemColumnList>
                </Pressable>

                <Pressable onPress={() => handleDeleteOrder(item.id)}>
                  <IconColumnList name='trash-2' size={20} />
                </Pressable>
              </GroupIconTextRow>
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
        <RegisterOrder 
          closeModal={setIsNewModalOpen} 
          updateList={() => loadOrders(filterOrderType, filterOrderId)}
          idOrder={idOrder}
        />
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