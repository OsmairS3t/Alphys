import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import HeaderModal from '../../components/HeaderModal';

import { ICategory, IProduct } from '../../../utils/interface';
import RegisterCategory from './regCategory';

import {
  HeaderScreenPage,
  ButtonNewScreenPage,
  IconButtonNewScreenPage,
  IconList
} from '../../styles/global';
import {
  ContainerModal,
  GroupColumn,
  ItemColumnList,
  GroupIconTextRow,
  IconColumnList,
  TextColumnList
} from '../../styles/registerStyle';
import { useCategoryDatabase } from '../../../hooks/useCategoryDatabase';

type CategoryProps = {
  closeModal: (value: boolean) => void;
}

export default function Category({ closeModal }: CategoryProps) {
  const categoryDatabase = useCategoryDatabase()
  const [search, setSearch] = useState('')
  const [idCategory, setIdCategory] = useState(0)
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  async function loadCategories() {
    try {
      const response = await categoryDatabase.searchByName(search)
      setCategories(response)
    } catch (error) {
      console.log(error)
    }
  }

  function handleNewCategoryModalOpen() {
    setIdCategory(0)
    setIsNewModalOpen(true)
  }

  function handleEditCategoryModalOpen(id: number) {
    setIdCategory(id)
    setIsNewModalOpen(true)
  }

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
    loadCategories();
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
          updateList={loadCategories}
          idCategory={idCategory}
        />
      </Modal>

    </ContainerModal>
  )
}
