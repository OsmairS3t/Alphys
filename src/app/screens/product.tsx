import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderModal from '../components/HeaderModal';

import { IProduct, ISale } from '../../utils/interface';
import { keyProduct, keySale } from '../../utils/keyStorage';
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
  const [idProduct, setIdProduct] = useState('')
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

  function handleEditProductModalOpen(id: string) {
    setIdProduct(id)
    setIsNewModalOpen(true)
  }

  async function deleteProduct(id: string) {
    try {
      const responseSale = await AsyncStorage.getItem(keySale)
      const sales: ISale[] = responseSale ? JSON.parse(responseSale) : []
      const saleProduct = sales.find(sal => sal.product?.id === id)
      if (saleProduct) {
        Alert.alert('Produto possui venda, por isso não pode ser excuído.')
      } else {
        const response = await AsyncStorage.getItem(keyProduct)
        const products: IProduct[] = response ? JSON.parse(response) : []
        const removedItem = products.filter(pro => pro.id !== id)
        await AsyncStorage.setItem(keyProduct, JSON.stringify(removedItem))
        loadProducts()
        Alert.alert('Produto excluído com sucesso!')
      }
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  function handleDeleteProduct(id: string) {
    Alert.alert(
      'Exclusao de Produtos',
      'Tem certeza que deseja excluir este produto?',
      [
        {
          text: 'Sim',
          onPress: () => {
            deleteProduct(id)
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

  function handleNewProductModalOpen() {
    setIdProduct('')
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
              <GroupIconTextRow>
                <Pressable onPress={() => handleEditProductModalOpen(item.id)}>
                  <ItemColumnList>
                    <TextColumnList>Categoria: {item.category?.name}</TextColumnList>
                    <TextColumnList>Produto: {item.name}</TextColumnList>
                    <TextColumnList>
                      Valor: {Intl.NumberFormat('pt-BR',
                        { style: 'currency', currency: 'BRL' })
                        .format(item.price)}
                    </TextColumnList>
                  </ItemColumnList>
                </Pressable>

                <Pressable onPress={() => handleDeleteProduct(item.id)}>
                  <IconColumnList name='trash-2' size={24} />
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
        visible={isNewModalOpen}
        onRequestClose={() => {
          setIsNewModalOpen(!isNewModalOpen)
        }}>
        <RegisterProduct
          updateList={loadProducts}
          closeModal={setIsNewModalOpen}
          idProduct={idProduct}
        />
      </Modal>
    </ContainerModal>
  )
}
