import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderModal from '../components/HeaderModal';

import { ICategory, IProduct } from '../../utils/interface';
import { keyCategory, keyProduct } from '../../utils/keyStorage';
import RegisterCategory from './regCategory';

import {
  HeaderScreenPage,
  ButtonNewScreenPage,
  IconButtonNewScreenPage,
  IconList
} from '../styles/global';
import {
  ContainerModal,
  GroupColumn,
  ItemColumnList,
  GroupIconTextRow,
  IconColumnList,
  TextColumnList
} from '../styles/registerStyle';
import { CategoryDatabase, useCategoryDatabase } from '../../databases/useCategoryDatabase';

type CategoryProps = {
  closeModal: (value: boolean) => void;
}

export default function Category({ closeModal }: CategoryProps) {
  const categoryDatabase = useCategoryDatabase()
  const [search, setSearch] = useState('')
  const [idCategory, setIdCategory] = useState(0)
  const [categories, setCategories] = useState<CategoryDatabase[]>([])
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  async function list() {
    try {
      const response = await categoryDatabase.searchByName(search)
      setCategories(response)
    } catch (error) {
      console.log(error)
    }
  }

  // async function loadCategories() {
  //   try {
  //     const response = await AsyncStorage.getItem(keyCategory)
  //     const dataCategory: ICategory[] = response ? JSON.parse(response) : []
  //     setCategories(dataCategory)
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }

  function handleNewCategoryModalOpen() {
    setIdCategory(0)
    setIsNewModalOpen(true)
  }

  function handleEditCategoryModalOpen(id: number) {
    setIdCategory(id)
    setIsNewModalOpen(true)
  }

  // async function deleteCategory(id: string) {
  //   try {
  //     const responseProduct = await AsyncStorage.getItem(keyProduct)
  //     const products: IProduct[] = responseProduct ? JSON.parse(responseProduct) : []
  //     const categoryProduct = products.find(prod => prod.category?.id === id)
  //     if (categoryProduct) {
  //       Alert.alert('Categoria já possui produto(s) cadastrado(s) a ela.')
  //     } else {
  //       const response = await AsyncStorage.getItem(keyCategory)
  //       const categories: ICategory[] = response ? JSON.parse(response) : []
  //       const removedItem = categories.filter(cat => cat.id !== id)
  //       await AsyncStorage.setItem(keyCategory, JSON.stringify(removedItem))
  //       loadCategories()
  //       Alert.alert('Categoria excluída com sucesso!')
  //     }
  //   } catch (error) {
  //     console.log('Erro ao tentar excluir: ', error)
  //   }
  // }

  function handleDeleteCategory(id: number) {
    Alert.alert(
      'Exclusao de categorias',
      'Tem certeza que deseja excluir esta categoria?',
      [
        {
          text: 'Sim',
          onPress: () => {
            categoryDatabase.del(id)
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
    list();
  }, [])

  return (
    <ContainerModal>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE CATEGORIAS' />

      <HeaderScreenPage>
        <ButtonNewScreenPage onPress={handleNewCategoryModalOpen}>
          <IconButtonNewScreenPage name='plus' size={24} />
        </ButtonNewScreenPage>
      </HeaderScreenPage>

      <GroupColumn>
        {categories.length > 0 ?
          <FlatList
            style={{ height: 450 }}
            data={categories}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) =>
              <ItemColumnList>
                <GroupIconTextRow>
                  <Pressable onPress={() => handleEditCategoryModalOpen(item.id)}>
                    <TextColumnList><IconList name='arrow-right' size={14} /> {item.name}</TextColumnList>
                  </Pressable>
                  <Pressable onPress={() => handleDeleteCategory(item.id)}>
                    <IconList name='trash-2' size={24} />
                  </Pressable>
                </GroupIconTextRow>
              </ItemColumnList>
            }
          />
          :
          <TextColumnList>Não há categorias de produtos cadastradas</TextColumnList>
        }
      </GroupColumn>

      <Modal
        transparent={true}
        animationType='fade'
        visible={isNewModalOpen}
        onRequestClose={() => {
          setIsNewModalOpen(!isNewModalOpen)
        }}>
        <RegisterCategory
          closeModal={setIsNewModalOpen}
          updateList={list}
          idCategory={idCategory}
        />
      </Modal>

    </ContainerModal>
  )
}
