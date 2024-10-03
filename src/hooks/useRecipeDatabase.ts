import { Alert } from 'react-native'
import { supabase } from '../databases/supabase'
import { IRecipe } from '../utils/interface'

export function useRecipeDatabase() {

  async function create(data: Omit<IRecipe, 'id'>) {
    try {
      const insertedRow = await supabase
        .from('recipes')
        .insert({
          nameproduct: data.nameproduct,
          preparation: data.preparation,
          cooking: data.cooking,
          ingredients: JSON.stringify(data.ingredients)
        })
        .select('id')
      return { insertedRow }
    } catch (error) {
      throw error
    }
  }

  async function update(data: IRecipe) {
    try {
      await supabase
        .from('recipes')
        .update({
          nameproduct: data.nameproduct,
          preparation: data.preparation,
          cooking: data.cooking,
          ingredients: JSON.stringify(data.ingredients)
        })
        .eq('id', data.id)
    } catch (error) {
      throw error
    }
  }

  async function remove(id: number) {
    try {
      await supabase.from('recipes').delete().eq('id', id)
      Alert.alert('Receita excluída com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function searchById(id: number) {
    try {
      const { data } = await supabase.from('recipes').select('*').eq('id', id)
      if(data) {
        return data[0]
      }
    } catch (error) {
      throw error
    }
  }
  
  async function searchByName(name: string) {
    try {
      const { data } = await supabase.from('recipes').select('*').like('nameproduct', name)
      if(data) {
        return data
      }
    } catch (error) {
      throw error
    }
  }

  async function find() {
    try {
      const { data } = await supabase.from('recipes').select('*')
      if(data) {
        return data
      }
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, searchById, searchByName, find }
}