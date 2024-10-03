import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import HeaderModal from '../../components/HeaderModal';

import { ICategory, IProduct } from '../../../utils/interface';
import RegisterCategory from './regCategory';
import { useCategoryDatabase } from '../../../hooks/useCategoryDatabase';

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
  TextColumnList
} from '../../styles/registerStyle';

type CategoryProps = {
  closeModal: (value: boolean) => void;
}

export default function Category({ closeModal }: CategoryProps) {
  const categoryDatabase = useCategoryDatabase()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<ICategory>()
  const [categories, setCategories] = useState<ICategory[]>([])
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  async function loadCategories() {
    try {
      const response = await categoryDatabase.find()
      if(response) {
        setCategories(response)
      }
    } catch (error) {
      console.log(error)
    }
  }

  function handleNewCategoryModalOpen() {
    setCategory(undefined)
    setIsNewModalOpen(true)
  }

  function handleEditCategoryModalOpen(item: ICategory) {
    setCategory(item)
    setIsNewModalOpen(true)
  }

  async function handleDeleteCategory(id: number) {
    Alert.alert(
      'Exclusao de categorias',
      'Tem certeza que deseja excluir esta categoria?',
      [
        {
          text: 'Sim',
          onPress: async() => {
            await categoryDatabase.remove(id)
            closeModal(false)
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
                  <Pressable onPress={() => handleEditCategoryModalOpen(item)}>
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
          category={category}
        />
      </Modal>

    </ContainerModal>
  )
}
