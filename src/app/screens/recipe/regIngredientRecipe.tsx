import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { IIngredient, IProduct, IRecipe } from '../../../utils/interface';
import * as ImagePicker from 'expo-image-picker';
import { InputForm } from '../../components/Forms/InputForm';

import HeaderModal from '../../components/HeaderModal';

import { ButtonForm, TextButton, TitleForm } from '../../styles/global';
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
} from '../../styles/recipeStyle';
import { useRecipeDatabase } from '../../../hooks/useRecipeDatabase';

type RecipeProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  recipe: IRecipe | undefined;
}

export default function RegisterIngreditenRecipe({ closeModal, updateList, recipe }: RecipeProps) {
  let title_page = 'NOVO CADASTRO'
  let idLastIngredient = 0
  const recipeDatabase = useRecipeDatabase()
  const [ingredients, setIngredients] = useState<IIngredient[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [conditions, setConditions] = useState('')

  async function loadIngredients() {
    if (recipe) {
      setIngredients(recipe.ingredients)
    }
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
      if(recipe) {
        oldingredients = recipe.ingredients
        oldingredients.push(dataIng)
        await recipeDatabase.update({
          id: recipe.id,
          nameproduct: recipe.nameproduct,
          ingredients: oldingredients,
          preparation: recipe.preparation,
          cooking: recipe.cooking
        })
      }

      // const {data, error} = await supabase.from('recipes')
      //   .select('*')
      //   .eq('id', recipe.id)
      // if (data) {
      //   oldingredients = data[0].ingredients
      //   // console.log(oldingredients)
      // }
      // if (error) {
      //   console.log('Inclusao de ingredientes: ', error)
      // }
      // oldingredients.push(dataIng)
      // await supabase.from('recipes').update({
      //   ingredients: oldingredients,
      // }).eq('id', recipe.id)

      updateList()
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    if (recipe) {
      loadIngredients()
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
