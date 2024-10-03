import { Alert } from 'react-native'
import { ICategory } from "../utils/interface"
import { supabase } from '../databases/supabase'

export function useCategoryDatabase() {

  async function create(data: Omit<ICategory, 'id'>) {
    try {
      const insertedRow = await supabase.from('categories').insert({
        name: data.name
      }).select('id')
      return { insertedRow }
    } catch (error) {
      throw error
    }
  }

  async function update(category: ICategory) {
    try {
      await supabase
        .from('categories')
        .update({ name: category.name })
        .eq('id',category.id)
    } catch (error) {
      throw error
    }
  }

  async function remove(id: number) {
    try {
      await supabase.from('categories').delete().eq('id', id)
      Alert.alert('Categoria excluída com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function find() {
    try {
      const response = await supabase.from('categories').select('*')
      return response.data
    } catch (error) {
      throw error
    }
  }

  async function searchByName(name: string) {
    try {
      const { data } = await supabase.from('categories').select('*').like('name', name)
      if(data){
        return data[0]
      }
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, find, searchByName }
}