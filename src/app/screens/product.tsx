import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, Modal } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderModal from '../components/HeaderModal';

import { IProduct } from '../../utils/interface';
import { keyProduct } from '../../utils/keyStorage';
import RegisterProduct from './regProduct';

import {
  HeaderScreenPage,
  ButtonNewScreenPage,
  IconButtonNewScreenPage
} from '../styles/global';
import {
  ContainerModal,
  GroupColumn,
  ItemColumnList,
  GroupIconTextRow,
  IconColumnList,
  TextColumnList
} from '../styles/registerStyle';

type ProductProps = {
  closeModal: (value: boolean) => void;
}

export default function Product({ closeModal }: ProductProps) {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [products, setProducts] = useState<IProduct[]>([]);

  async function loadProducts() {
    try {
      const response = await AsyncStorage.getItem(keyProduct)
      const dataProduct: IProduct[] = response ? JSON.parse(response) : []
      setProducts(dataProduct)
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewProductModalOpen() {
    setIsNewModalOpen(true)
  }

  useFocusEffect(
    useCallback(() => {
      loadProducts();
    }, [])
  )

  return (
    <ContainerModal>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE PRODUTOS' />

      <HeaderScreenPage>
        <ButtonNewScreenPage onPress={handleNewProductModalOpen}>
          <IconButtonNewScreenPage name='plus' size={24} />
        </ButtonNewScreenPage>
      </HeaderScreenPage>

      <GroupColumn>
        {products.length > 0 ?
          <FlatList
            style={{ height: 450 }}
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <Pressable onPress={() => { }}>
                <ItemColumnList>
                  <TextColumnList>Categoria: {item.category?.name}</TextColumnList>
                  <TextColumnList>Produto: {item.name}</TextColumnList>
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
        visible={isNewModalOpen}
        onRequestClose={() => {
          setIsNewModalOpen(!isNewModalOpen)
        }}>
        <RegisterProduct closeModal={setIsNewModalOpen} />
      </Modal>
    </ContainerModal>
  )
}
