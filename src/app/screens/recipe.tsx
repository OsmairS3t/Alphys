import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, Modal } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderModal from '../components/HeaderModal';

import { IClient, IRecipe } from '../../utils/interface';
import { keyClient, keyRecipe } from '../../utils/keyStorage';
import RegisterRecipe from './regRecipe';

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


type RecipeProps = {
  closeModal: (value: boolean) => void;
}

export default function Recipe({ closeModal }: RecipeProps) {
  const [idRecipe, setIdRecipe] = useState('')
  const [recipes, setRecipes] = useState<IRecipe[]>([])
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  async function loadRecipes() {
    try {
      const response = await AsyncStorage.getItem(keyRecipe)
      const dataRecipe: IRecipe[] = response ? JSON.parse(response) : []
      setRecipes(dataRecipe)
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewRecipeModalOpen() {
    setIsNewModalOpen(true)
  }

  function handleEditRecipeModalOpen(id: string) {
    setIdRecipe(id)
    setIsNewModalOpen(true)
  }

  useFocusEffect(
    useCallback(() => {
      loadRecipes();
    }, [])
  )

  return (
    <ContainerModal>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE RECEITAS' />

      <HeaderScreenPage>
        <ButtonNewScreenPage onPress={handleNewRecipeModalOpen}>
          <IconButtonNewScreenPage name='plus' size={24} />
        </ButtonNewScreenPage>
      </HeaderScreenPage>

      <GroupColumn>
        {recipes.length > 0 ?
          <FlatList
            style={{ height: 450 }}
            data={recipes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <GroupIconTextRow>
                <Pressable onPress={() => { handleEditRecipeModalOpen(item.id) }}>
                  <ItemColumnList>
                    <TextColumnList>{item.nameproduct}</TextColumnList>
                  </ItemColumnList>
                </Pressable>

                <Pressable onPress={() => { }}>
                  <ItemColumnList>
                    <IconColumnList name='trash-2' size={20} />
                  </ItemColumnList>
                </Pressable>
              </GroupIconTextRow>
            }
          />
          :
          <TextColumnList>Não há receitas cadastradas</TextColumnList>
        }
      </GroupColumn>

      <Modal
        transparent={true}
        animationType='fade'
        visible={isNewModalOpen}
        onRequestClose={() => {
          setIsNewModalOpen(!isNewModalOpen)
        }}>
        <RegisterRecipe closeModal={setIsNewModalOpen} updateList={loadRecipes} idRecipe={idRecipe} />
      </Modal>

    </ContainerModal>
  )
}
