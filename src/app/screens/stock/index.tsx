import { useState, useEffect, useCallback } from 'react';
import { Modal, FlatList, Pressable, Alert, Text } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RegisterStock from './regStock';
import FilterStock from '../../components/Filter/filterstock';

import { keyStock } from '../../../utils/keyStorage';
import { IStock } from '../../../utils/interface';

import {
  ContainerModal,
  GroupColumn,
  ItemColumnList,
  GroupIconTextRow,
  IconColumnList,
  TextColumnList
} from '../../styles/registerStyle';
import {
  HeaderStock,
  ButtonFilterStock,
  IconFilterStock,
  ButtonNewStock,
  IconButtonNewStock
} from '../../styles/stockStyle'
import HeaderModal from '../../components/HeaderModal';
import { useStockDatabase } from '../../../hooks/useStockDatabase';

type StockProps = {
  closeModal: (value: boolean) => void;
}

export default function Stock({ closeModal }: StockProps) {
  const stockDatabase = useStockDatabase()
  const [search, setSearch] = useState('')
  const [stock, setStock] = useState<IStock>()
  const [stocks, setStocks] = useState<IStock[]>([])
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)

  async function loadStock() {
    try {
      const response = await stockDatabase.find()
      if(response) {
        setStocks(response)
      }
    } catch (e) {
      console.log(e)
    }
  }

  function handleFilterModalOpen() {
    setIsFilterModalOpen(true)
  }

  function handleNewStockModalOpen() {
    setStock(undefined)
    setIsStockModalOpen(true)
  }

  function handleEditStockModalOpen(item: IStock) {
    setStock(item)
    setIsStockModalOpen(true)
  }

  async function deleteStock(id: number) {
    try {
      await stockDatabase.remove(id)
      Alert.alert('Produto excluído do estoque com sucesso!')
      loadStock()
    } catch (error) {
      console.log('Erro ao tentar excluir prod: ', error)
    }
  }

  function handleDeleteStock(id: number) {
    Alert.alert(
      'Exclusao de Produtos',
      'Tem certeza que deseja excluir este produto?',
      [
        {
          text: 'Sim',
          onPress: () => {
            deleteStock(id)
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
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) =>
              <GroupIconTextRow>
                <Pressable onPress={() => handleEditStockModalOpen(item)}>
                  <ItemColumnList>
                      <TextColumnList>{item.product_name}</TextColumnList>
                      <TextColumnList>{item.amount} itens</TextColumnList>
                  </ItemColumnList>
                </Pressable>

                <Pressable onPress={() => handleDeleteStock(item.id)}>
                  <TextColumnList>
                    <IconColumnList name='trash-2' size={24} />
                  </TextColumnList>
                </Pressable>
              </GroupIconTextRow>
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
        <RegisterStock 
          closeModal={setIsStockModalOpen} 
          updateList={loadStock}
          stock={stock} 
        />
      </Modal>
    </ContainerModal>
  )
}