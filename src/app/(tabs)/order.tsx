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
import { useOrderDatabase } from '../../hooks/useOrderDatabase';

interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
  photo: string;
}

export default function Order() {
  const theme = useTheme()
  const orderDatabase = useOrderDatabase()
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [filterOrderType, setFilterOrderType] = useState('C') //C (client) or P (product)
  const [filterOrderId, setFilterOrderId] = useState('')
  const [order, setOrder] = useState<IOrder>()
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [users, setUsers] = useState<IUser[]>([])
 
  async function loadOrders(typeFilter: string, filter: string) {
    try {
      if (typeFilter === '') {
        const response = await orderDatabase.list()
        setOrders(response)
      } else {
        const response = await orderDatabase.searchByName(filter, typeFilter)
        setOrders(response)
      }
    } catch (e) {
      console.log(e)
    }
  }

  function handleFilterModalOpen() {
    setIsFilterModalOpen(true)
  }

  function handleNewBuyModalOpen() {
    setOrder(undefined)
    setIsNewModalOpen(true)
  }

  function handleEditBuyModalOpen(item: IOrder) {
    setOrder(item)
    setIsNewModalOpen(true)
  }

  async function deleteOrder(id: number) {
    try {
      await orderDatabase.remove(id)
      loadOrders(filterOrderType, filterOrderId)
      Alert.alert('Encomenda excluída com sucesso!')
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  function handleDeleteOrder(id: number) {
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
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) =>
              <GroupIconTextRow>
                <Pressable onPress={() => handleEditBuyModalOpen(item)}>
                  <ItemColumnList>
                    <TextColumnList>Cliente: {item.client_name}</TextColumnList>
                    <TextColumnList>Produto: {item.product_name}</TextColumnList>
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
          order={order}
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
          setFilterSearch={setFilterOrderId} 
        />
      </Modal>
      

    </Container>
  )
}