import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IIngredient, IProduct, IRecipe } from '../../utils/interface';
import { keyRecipe } from '../../utils/keyStorage';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { InputForm } from '../components/Forms/InputForm';

import HeaderModal from '../components/HeaderModal';

import { ButtonForm, TextButton, TitleForm } from '../styles/global';
import {
  Container,
  Title,
  TitleRecipe,
  TextRecipe,
  GroupImage,
  GroupButton,
  TexttypeBalance,
  BtnImage,
  IconImage,
  IconCamera,
  PhotoImage,
  ImgCapture
} from '../styles/recipeStyle';
import { supabase } from '../../databases/supabase';


type RecipeProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  idRecipe: string;
}

export default function RegisterIngreditenRecipe({ closeModal, updateList, idRecipe }: RecipeProps) {
  let title_page = 'NOVO CADASTRO'
  let idLastIngredient = 0
  const [recipe, setRecipe] = useState<IRecipe>()
  const [ingredients, setIngredients] = useState<IIngredient[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [conditions, setConditions] = useState('')

  async function loadIngredients(id: string) {
    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', idRecipe)
    if (data) {
      setRecipe(data[0])
      setIngredients(data[0].ingredients)
    }
    if (error) {
      console.log(error)
    }

    const response = await AsyncStorage.getItem(keyRecipe)
    const objRecipe: IRecipe[] = response ? JSON.parse(response) : []
    const foundedRecipe = objRecipe.find(rec => rec.id === id)
    setIngredients(foundedRecipe ? foundedRecipe.ingredients : [])
  }

  function obterProximoIdIngrediente(receita: IRecipe): number {
    const ultimoIdIngrediente = Math.max(
      ...receita.ingredients.map((ingrediente) => Number(ingrediente.id))
    );
    return ultimoIdIngrediente === -Infinity ? 1 : ultimoIdIngrediente + 1;
  }

  async function handleSave() {
    idLastIngredient = obterProximoIdIngrediente(recipe as IRecipe)
    let oldingredients = []
    const dataIng = {
      id: idLastIngredient,
      name: name,
      amount: amount,
      conditions: conditions
    }
    try {
      const {data, error} = await supabase.from('recipes')
        .select('*')
        .eq('id', idRecipe)
      if (data) {
        oldingredients = data[0].ingredients
        console.log(oldingredients)
      }
      if (error) {
        console.log('Inclusao de ingredientes: ', error)
      }
      oldingredients.push(dataIng)
      await supabase.from('recipes').update({
        ingredients: oldingredients,
      }).eq('id', idRecipe)

      // const response = await AsyncStorage.getItem(keyRecipe)
      // let oldData: IRecipe[] = response ? JSON.parse(response) : []
      // const foundRecipe = oldData.find(od => od.id === idRecipe)
      // if (foundRecipe) {
      //   let ingredientsData: IIngredient[] = foundRecipe.ingredients
      //   ingredientsData.push(dataIng)
      //   const dataRecipe = {
      //     id: foundRecipe.id,
      //     nameproduct: foundRecipe.nameproduct,
      //     ingredients: ingredientsData,
      //     cooking: foundRecipe.cooking,
      //     preparation: foundRecipe.preparation
      //   }
      //   let updateData = oldData.filter(od => od.id !== idRecipe)
      //   updateData.push(dataRecipe)
      //   await AsyncStorage.setItem(keyRecipe, JSON.stringify(updateData))
      //   Alert.alert('Ingrediente incluído na receita com sucesso!')
      // }

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
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE INGREDIENTES' />

      <Title>{title_page}</Title>
      <TitleRecipe>{recipe ? 'Receita de '+ recipe.nameproduct : ''}</TitleRecipe>
      
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

      <TitleRecipe>Já incluidos:</TitleRecipe>
      {
        recipe ? 
        recipe.ingredients.map(item => (
          <TextRecipe key={item.id}>- {item.name}</TextRecipe>
        ))
        : ''
      }

    </Container>
  )
}
