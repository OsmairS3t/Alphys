import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IIngredient, IProduct, IRecipe } from '../../utils/interface';
import { keyRecipe } from '../../utils/keyStorage';
import uuid from 'react-native-uuid';
import { InputForm } from '../components/Forms/InputForm';

import HeaderModal from '../components/HeaderModal';

import { ButtonForm, TextButton } from '../styles/global';
import {
  Container,
  Title,
  GroupRecipe,
  TitleRecipe,
  TextRecipe,
  TextIngredient
} from '../styles/recipeStyle';
import {GroupList} from '../styles/registerStyle'
import { supabase } from '../../databases/supabase';

type RecipeProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  idRecipe: string;
  viewRecipe: boolean;
}

export default function RegisterRecipe({ closeModal, updateList, idRecipe, viewRecipe }: RecipeProps) {
  let title_page = idRecipe === '' ? 'NOVO CADASTRO' : 'EDITR CADASTRO'
  const [recipe, setRecipe] = useState<IRecipe>()
  const [nameProduct, setNameProduct] = useState('')
  const [preparation, setPreparation] = useState('')
  const [cooking, setCooking] = useState('')

  async function loadRecipe(id: string) {
    const { data, error } = await supabase.from('recipes').select('*')
    if (data) {
      const objRecipe: IRecipe[] = data
      const foundRecipe = objRecipe.find(rec => rec.id === id)
      setRecipe(foundRecipe)
      setNameProduct(String(foundRecipe?.nameproduct))
      setPreparation(String(foundRecipe?.preparation))
      setCooking(String(foundRecipe?.cooking))
    }
    if (error) { console.log(error) }
    // const response = await AsyncStorage.getItem(keyRecipe)
    // const objRecipe: IRecipe[] = response ? JSON.parse(response) : []
    // const foundRecipe = objRecipe.find(rec => rec.id === id)
    // setRecipe(foundRecipe)
    // setNameProduct(String(foundRecipe?.nameproduct))
    // setPreparation(String(foundRecipe?.preparation))
    // setCooking(String(foundRecipe?.cooking))
  }

  async function handleSave() {
    const dataRecipe = {
      id: uuid.v4().toString(),
      nameproduct: nameProduct,
      ingredients: [],
      preparation: preparation,
      cooking: cooking
    }
    try {
      const {data, error} = await supabase.from('recipes').select('*').eq('id', idRecipe)
      if (data) {
        await supabase.from('recipes').update({
          nameproduct: nameProduct,
          preparation: preparation,
          cooking: cooking,
          ingredients: data[0].ingredients,
        }).eq('id', idRecipe)
        Alert.alert('Receita atualizada com sucesso!')
      } else {
        await supabase.from('recipes').insert({
          nameproduct: nameProduct,
          preparation: preparation,
          cooking: cooking,
          ingredients: [],
        })
        Alert.alert('Receita incluída com sucesso!')
      } 
      updateList()
      closeModal(false);
      if (error) {
        console.log(error)
      }
      // const response = await AsyncStorage.getItem(keyRecipe)
      // let oldData: IRecipe[] = response ? JSON.parse(response) : []
      // const foundRecipe = oldData.find(od => od.id === idRecipe)
      // if(!foundRecipe) {
      //   oldData.push(dataRecipe)
      //   await AsyncStorage.setItem(keyRecipe, JSON.stringify(oldData))
      //   Alert.alert('Receita incluída com sucesso!')
      // } else {
      //   const updateData = oldData.filter(od => od.id !== idRecipe)
      //   updateData.push(dataRecipe)
      //   await AsyncStorage.setItem(keyRecipe, JSON.stringify(updateData))
      //   Alert.alert('Receita atualizada com sucesso!')
      // }
      // updateList()
      // closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    if(idRecipe !=='') {
      loadRecipe(idRecipe)
    }
  },[])
  
  if(viewRecipe) {
    return (
      <Container>
        <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE RECEITAS' />
        <Title>VISUALIZAR RECEITA</Title>
        
        <GroupRecipe direction='row'>
          <TitleRecipe>Produto: </TitleRecipe>
          <TextRecipe>{nameProduct}</TextRecipe>
        </GroupRecipe>

        <GroupRecipe direction='column'>
          <TitleRecipe>Modo de preparo: </TitleRecipe>
          <TextRecipe>{preparation}</TextRecipe>
        </GroupRecipe>

        <GroupRecipe direction='column'>
          <TitleRecipe numberOfLines={2}>Tempo de cozimento:</TitleRecipe>
          <TextRecipe>{cooking}</TextRecipe>
        </GroupRecipe>
  
        <GroupRecipe direction='column'>
          <TitleRecipe>Ingredientes:</TitleRecipe>
          <ScrollView>
            {recipe?.ingredients.map(ing => (
              <GroupList key={ing.id}>
                <TextIngredient>-</TextIngredient>
                <TextIngredient>
                  {ing.name} - {ing.amount} {ing.conditions}
                </TextIngredient>
              </GroupList>
            ))}
          </ScrollView>
        </GroupRecipe>

      </Container>
    )
  } else {
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
          placeholder='Modo de preparo:'
          onChangeText={text => setPreparation(text)}
          value={preparation}
        />
  
        <InputForm
          placeholder='Tempo de cozimento:'
          onChangeText={text => setCooking(text)}
          value={cooking}
        />
        
        <GroupRecipe direction='column'>
          <TitleRecipe>Ingredientes:</TitleRecipe>
          <ScrollView>
            {recipe?.ingredients.map(ing => (
              <GroupList key={ing.id}>
                <TextIngredient>
                  - {ing.name} - {ing.amount} {ing.conditions}
                </TextIngredient>
              </GroupList>
            ))}
          </ScrollView>
        </GroupRecipe>

        <ButtonForm onPress={handleSave}>
          <TextButton>Salvar</TextButton>
        </ButtonForm>
      </Container>
    )
  }
}
