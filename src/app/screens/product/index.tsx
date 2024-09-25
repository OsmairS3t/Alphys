import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';

import HeaderModal from '../../components/HeaderModal';

import { IProduct, ISale } from '../../../utils/interface';
import RegisterProduct from './regProduct';

import {
  HeaderScreenPage,
  ButtonNewScreenPage,
  IconButtonNewScreenPage
} from '../../styles/global';
import {
  ContainerModal,
  GroupColumn,
  ItemColumnList,
  GroupIconTextRow,
  IconColumnList,
  TextColumnList
} from '../../styles/registerStyle';
import { useProductDatabase } from '../../../hooks/useProductDatabase';
import { useTransactionDatabase } from '../../../hooks/useTransactionDatabase';

type ProductProps = {
  closeModal: (value: boolean) => void;
}

export default function Product({ closeModal }: ProductProps) {
  const productDatabase = useProductDatabase()
  const transactionDatabase = useTransactionDatabase()
  const [search, setSeach] = useState('')
  const [product, setProduct] = useState<IProduct>()
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('')
  const [products, setProducts] = useState<IProduct[]>([]);

  async function loadProducts() {
    try {
      const response = await productDatabase.searchByName(search)
      setProducts(response)
    } catch (e) {
      console.log(e)
    }
  }

  function handleEditProductModalOpen(prod: IProduct) {
    setProduct(prod)
    setIsNewModalOpen(true)
  }

  async function deleteProduct(id: number) {
    try {
      const responseProduct = await productDatabase.searchById(id)
      if(responseProduct) {
        const responseSale = await transactionDatabase.searchByProduct(responseProduct.name)
        if (responseSale) {
          Alert.alert('Produto possui venda, por isso não pode ser excuído.')
        }
      } else {
        await productDatabase.remove(id)
        Alert.alert('Produto excluído com sucesso!')
      }
      loadProducts()
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  function handleDeleteProduct(id: number) {
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
    setProduct(undefined)
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
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) =>
              <GroupIconTextRow>
                <Pressable onPress={() => handleEditProductModalOpen(item)}>
                  <ItemColumnList>
                    <TextColumnList>Categoria: {item.categoryname}</TextColumnList>
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
          product={product}
        />
      </Modal>
    </ContainerModal>
  )
}
