import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { IRecipe } from '../../../utils/interface';
import { InputForm } from '../../components/Forms/InputForm';
import HeaderModal from '../../components/HeaderModal';
import { ButtonForm, TextButton } from '../../styles/global';
import {
  Container,
  Title,
  GroupRecipe,
  TitleRecipe,
  TextRecipe,
  TextIngredient
} from '../../styles/recipeStyle';
import {GroupList} from '../../styles/registerStyle'
import { supabase } from '../../../databases/supabase';
import { useRecipeDatabase } from '../../../hooks/useRecipeDatabase';

type RecipeProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  recipe: IRecipe | undefined;
  viewRecipe: boolean;
}

export default function RegisterRecipe({ closeModal, updateList, recipe, viewRecipe }: RecipeProps) {
  let title_page = recipe ? 'EDITR CADASTRO' : 'NOVO CADASTRO'
  const recipeDatabase = useRecipeDatabase()
  const [nameProduct, setNameProduct] = useState('')
  const [preparation, setPreparation] = useState('')
  const [cooking, setCooking] = useState('')

  async function loadRecipe() {
    if (recipe) {
      setNameProduct(recipe.nameproduct)
      setPreparation(recipe.preparation)
      setCooking(recipe.cooking)
    }
  }

  async function handleSave() {
    try {
      if(recipe) {
        await recipeDatabase.update({
          id: recipe.id,
          nameproduct: nameProduct,
          preparation: preparation,
          cooking: cooking,
          ingredients: recipe.ingredients
        })
        Alert.alert('Receita atualizada com sucesso!')
      } else {
        await recipeDatabase.create({
          nameproduct: nameProduct,
          preparation: preparation,
          cooking: cooking,
          ingredients: []
        })
        Alert.alert('Receita incluída com sucesso!')
      }
      // const {data, error} = await supabase.from('recipes').select('*').eq('id', recipe.id)
      // if (data) {
      //   await supabase.from('recipes').update({
      //     nameproduct: nameProduct,
      //     preparation: preparation,
      //     cooking: cooking,
      //     ingredients: data[0].ingredients,
      //   }).eq('id', recipe.id)
      // } else {
      //   await supabase.from('recipes').insert({
      //     nameproduct: nameProduct,
      //     preparation: preparation,
      //     cooking: cooking,
      //     ingredients: [],
      //   })
      // } 
      updateList()
      closeModal(false);
      // if (error) {
      //   console.log(error)
      // }
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    if(recipe) {
      loadRecipe()
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
