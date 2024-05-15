import React, { useState } from 'react';
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

export default function RegisterRecipe({ closeModal, updateList, idRecipe }: RecipeProps) {
  let title_page = idRecipe === '' ? 'NOVO CADASTRO' : 'EDITAR CADASTRO'
  const [preparation, setPreparation] = useState('')
  const [cooking, setCooking] = useState('')
  const [nameProduct, setNameProduct] = useState('')


  async function handleSave() {
    const data = {
      id: uuid.v4().toString(),
      nameproduct: nameProduct,
      ingredients: {} as IIngredient[],
      preparation: preparation,
      cooking: cooking
    }
    try {
      const response = await AsyncStorage.getItem(keyRecipe)
      let oldData: IRecipe[] = response ? JSON.parse(response) : []

      oldData.push(data)

      // await AsyncStorage.removeItem(keyClient)
      await AsyncStorage.setItem(keyRecipe, JSON.stringify(oldData))
      Alert.alert('Receita incluída com sucesso!')
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE RECEITAS' />

      <Title>{title_page}</Title>
      <InputForm
        placeholder='Nome do Produto'
        onChangeText={text => setNameProduct(text)}
        value={nameProduct}
      />

      <InputForm
        placeholder='Ingrediente'
      />

      <InputForm
        placeholder='Modo de preparo:'
        onChangeText={text => setPreparation(text)}
        value={preparation}
      />

      <InputForm
        placeholder='Tempo de cozimento:'
        onChangeText={text => setCooking(text)}
        value={cooking}
      />

      <ButtonForm onPress={handleSave}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>
    </Container>
  )
}
