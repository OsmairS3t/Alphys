import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderModal from '../components/HeaderModal';

import { ICategory } from '../../utils/interface';
import { keyCategory } from '../../utils/keyStorage';
import RegisterCategory from './regCategory';

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
import { useFocusEffect } from 'expo-router';

type CategoryProps = {
  closeModal: (value: boolean) => void;
}

export default function Category({ closeModal }: CategoryProps) {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  async function loadCategories() {
    try {
      const response = await AsyncStorage.getItem(keyCategory)
      const dataCategory: ICategory[] = response ? JSON.parse(response) : []
      setCategories(dataCategory)
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewCategoryModalOpen() {
    setIsNewModalOpen(true)
  }

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  )

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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <Pressable onPress={() => { }}>
                <ItemColumnList>
                  <GroupIconTextRow>
                    <TextColumnList>Categoria: {item.name}</TextColumnList>
                    <IconColumnList name={item.icon} size={20} />
                  </GroupIconTextRow>
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
        <RegisterCategory closeModal={setIsNewModalOpen} />
      </Modal>

    </ContainerModal>
  )
}
