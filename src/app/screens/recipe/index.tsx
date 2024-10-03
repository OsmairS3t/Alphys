import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../../databases/supabase';

import HeaderModal from '../../components/HeaderModal';

import { IClient, IRecipe } from '../../../utils/interface';
import { keyClient, keyRecipe } from '../../../utils/keyStorage';
import RegisterRecipe from './regRecipe';
import RegisterIngreditenRecipe from './regIngredientRecipe';

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
  TextColumnList,
  BtnItem,
  TextBtnItem
} from '../../styles/registerStyle';
import { useRecipeDatabase } from '../../../hooks/useRecipeDatabase';

type RecipeProps = {
  closeModal: (value: boolean) => void;
}

export default function Recipe({ closeModal }: RecipeProps) {
  const recipeDatabase = useRecipeDatabase()
  const [search, setSearch] = useState('')
  const [recipe, setRecipe] = useState<IRecipe>()
  const [viewRecipe, setViewRecipe] = useState(false)
  const [recipes, setRecipes] = useState<IRecipe[]>([])
  const [isIngModalOpen, setIsIngModalOpen] = useState(false)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  async function loadRecipes() {
    try {
      const response = await recipeDatabase.find()
      if (response) {
        setRecipes(response)
      }
      // const { data, error } = await supabase.from('recipes').select('*')
      // if (data) {
      //   setRecipes(data)
      // }
      // if (error) {
      //   console.log(error)
      // }
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewRecipeModalOpen() {
    setIsNewModalOpen(true)
    setRecipe(undefined)
  }

  function handleEditRecipeModalOpen(item: IRecipe) {
    setViewRecipe(false)
    setRecipe(item)
    setIsNewModalOpen(true)
  }

  function handleViewRecipeModalOpen(item: IRecipe, view: boolean) {
    setViewRecipe(true)
    setRecipe(item)
    setIsNewModalOpen(true)
  }

  function handleNewIngredientMOdalOpen(item: IRecipe) {
    setViewRecipe(false)
    setRecipe(item)
    setIsIngModalOpen(true)
  }

  async function deleteRecipe(id: number) {
    try {
      await recipeDatabase.remove(id)
      loadRecipes()
      Alert.alert('Receita excluída com sucesso!')
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  function handleDeleteRecipe(id: number) {
    Alert.alert(
      'Exclusao de Receitas',
      'Tem certeza que deseja excluir esta receita?',
      [
        {
          text: 'Sim',
          onPress: () => {
            deleteRecipe(id)
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
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) =>
              <GroupIconTextRow>
                <Pressable onPress={() => handleEditRecipeModalOpen(item)} style={{ flex: 1 }}>
                  <ItemColumnList>
                    <TextColumnList>{item.nameproduct}</TextColumnList>
                  </ItemColumnList>
                </Pressable>
                
                <BtnItem onPress={() => handleViewRecipeModalOpen(item, viewRecipe)}>
                  <IconColumnList name='eye' size={20} />
                </BtnItem>

                <BtnItem onPress={() => handleNewIngredientMOdalOpen(item)}>
                  <TextBtnItem>+ ING</TextBtnItem>
                </BtnItem>

                <Pressable onPress={() => handleDeleteRecipe(item.id)}>
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
        <RegisterRecipe
          closeModal={setIsNewModalOpen}
          updateList={loadRecipes}
          recipe={recipe}
          viewRecipe={viewRecipe}
        />
      </Modal>

      <Modal
        transparent={true}
        animationType='fade'
        visible={isIngModalOpen}
        onRequestClose={() => {
          setIsIngModalOpen(!isIngModalOpen)
        }}>
        <RegisterIngreditenRecipe
          closeModal={setIsIngModalOpen}
          updateList={loadRecipes}
          recipe={recipe}
        />
      </Modal>

    </ContainerModal>
  )
}
