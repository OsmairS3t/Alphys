import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IIngredient, IProduct, IRecipe } from '../../utils/interface';
import { keyRecipe } from '../../utils/keyStorage';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { InputForm } from '../components/Forms/InputForm';

import HeaderModal from '../components/HeaderModal';

import { ButtonForm, TextButton } from '../styles/global';
import {
  Container,
  Title,
  GroupImage,
  GroupButton,
  TexttypeBalance,
  BtnImage,
  IconImage,
  IconCamera,
  PhotoImage,
  ImgCapture
} from '../styles/recipeStyle';


type RecipeProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  idRecipe: string;
}

export default function RegisterIngreditenRecipe({ closeModal, updateList, idRecipe }: RecipeProps) {
  let title_page = idRecipe === '' ? 'NOVO CADASTRO' : 'EDITAR CADASTRO'
  const [ingredients, setIngredients] = useState<IIngredient[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [conditions, setConditions] = useState('')

  async function loadIngredients(id: string) {
    const response = await AsyncStorage.getItem(keyRecipe)
    const objRecipe: IRecipe[] = response ? JSON.parse(response) : []
    const foundedRecipe = objRecipe.find(rec => rec.id === id)
    setIngredients(foundedRecipe ? foundedRecipe.ingredients : [])
  }

  async function handleSave() {
    const dataIng = {
      id: uuid.v4().toString(),
      name: name,
      amount: amount,
      conditions: conditions
    }
    try {
      const response = await AsyncStorage.getItem(keyRecipe)
      let oldData: IRecipe[] = response ? JSON.parse(response) : []
      const foundRecipe = oldData.find(od => od.id === idRecipe)
      if (foundRecipe) {
        let ingredientsData: IIngredient[] = foundRecipe.ingredients
        ingredientsData.push(dataIng)
        const dataRecipe = {
          id: foundRecipe.id,
          nameproduct: foundRecipe.nameproduct,
          ingredients: ingredientsData,
          cooking: foundRecipe.cooking,
          preparation: foundRecipe.preparation
        }
        let updateData = oldData.filter(od => od.id !== idRecipe)
        updateData.push(dataRecipe)
        await AsyncStorage.setItem(keyRecipe, JSON.stringify(updateData))
        Alert.alert('Ingrediente incluído na receita com sucesso!')
      }
      updateList()
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    if (idRecipe !== '') {
      loadIngredients(idRecipe)
    }
  }, [])

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE RECEITAS' />

      <Title>{title_page}</Title>
      <InputForm
        placeholder='Nome do Ingrediente'
        onChangeText={text => setName(text)}
        value={name}
      />

      <InputForm
        placeholder='Quantidade:'
        onChangeText={text => setAmount(text)}
        value={amount}
      />

      <InputForm
        placeholder='Condições (frio, quente...):'
        onChangeText={text => setConditions(text)}
        value={conditions}
      />

      <ButtonForm onPress={handleSave}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>


    </Container>
  )
}
