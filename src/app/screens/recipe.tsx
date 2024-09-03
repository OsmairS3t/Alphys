import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderModal from '../components/HeaderModal';

import { IClient, IRecipe } from '../../utils/interface';
import { keyClient, keyRecipe } from '../../utils/keyStorage';
import RegisterRecipe from './regRecipe';
import RegisterIngreditenRecipe from './regIngredientRecipe';

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
  TextColumnList,
  BtnItem,
  TextBtnItem
} from '../styles/registerStyle';
import { supabase } from '../../databases/supabase';

type RecipeProps = {
  closeModal: (value: boolean) => void;
}

export default function Recipe({ closeModal }: RecipeProps) {
  const [idRecipe, setIdRecipe] = useState('')
  const [viewRecipe, setViewRecipe] = useState(false)
  const [recipes, setRecipes] = useState<IRecipe[]>([])
  const [isIngModalOpen, setIsIngModalOpen] = useState(false)
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  async function loadRecipes() {
    try {
      const { data, error } = await supabase.from('recipes').select('*')
      if (data) {
        setRecipes(data)
      }
      if (error) {
        console.log(error)
      }
      // const response = await AsyncStorage.getItem(keyRecipe)
      // const dataRecipe: IRecipe[] = response ? JSON.parse(response) : []
      // setRecipes(dataRecipe)
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewRecipeModalOpen() {
    setIsNewModalOpen(true)
    setIdRecipe('')
  }

  function handleEditRecipeModalOpen(id: string) {
    setViewRecipe(false)
    setIdRecipe(id)
    setIsNewModalOpen(true)
  }

  function handleViewRecipeModalOpen(id: string, view: boolean) {
    setViewRecipe(true)
    setIdRecipe(id)
    setIsNewModalOpen(true)
  }

  function handleNewIngredientMOdalOpen(id: string) {
    setViewRecipe(false)
    setIdRecipe(id)
    setIsIngModalOpen(true)
  }

  async function deleteRecipe(id: string) {
    try {
      const response = await AsyncStorage.getItem(keyRecipe)
      const recipes: IRecipe[] = response ? JSON.parse(response) : []
      const removedItem = recipes.filter(rec => rec.id !== id)
      await AsyncStorage.setItem(keyRecipe, JSON.stringify(removedItem))
      loadRecipes()
      Alert.alert('Receita excluída com sucesso!')
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  function handleDeleteRecipe(id: string) {
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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <GroupIconTextRow>
                <Pressable onPress={() => handleEditRecipeModalOpen(item.id)} style={{ flex: 1 }}>
                  <ItemColumnList>
                    <TextColumnList>{item.nameproduct}</TextColumnList>
                  </ItemColumnList>
                </Pressable>
                
                <BtnItem onPress={() => handleViewRecipeModalOpen(item.id, viewRecipe)}>
                  <IconColumnList name='eye' size={20} />
                </BtnItem>

                <BtnItem onPress={() => handleNewIngredientMOdalOpen(item.id)}>
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
          idRecipe={idRecipe}
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
          idRecipe={idRecipe}
        />
      </Modal>

    </ContainerModal>
  )
}
