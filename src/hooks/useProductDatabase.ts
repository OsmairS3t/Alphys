import { Alert } from 'react-native'
import { IProduct } from '../utils/interface'
import { supabase } from '../databases/supabase'

export function useProductDatabase() {

  async function create(data: Omit<IProduct, 'id'>) {
    try {
      const insertedRow = await supabase
        .from('products')
        .insert({
          categoryname: data.categoryname,
          name: data.name,
          price: data.price,
          photo: data.photo,
        })
        .select('id')
      return { insertedRow }
    } catch (error) {
      throw error
    }
  }

  async function update(data: IProduct) {
    try {
      await supabase
        .from('products')
        .update({
          categoryname: data.categoryname,
          name: data.name,
          price: data.price,
          photo: data.photo
        })
        .eq('id', data.id)
    } catch (error) {
      throw error
    }
  }

  async function remove(id: number) {
    try {
      await supabase.from('products').delete().eq('id', id)
      Alert.alert('Produto excluído com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function searchById(id: number) {
    try {
      const {data} = await supabase.from('products').select('*').eq('id', id)
      if(data) {
        return data[0]
      }
    } catch (error) {
      throw error
    }
  }

  async function searchByName(name: string) {
    try {
      const { data } = await supabase.from('products').select('*').eq('name', name)
      if (data){
        return data[0]
      }
    } catch (error) {
      throw error
    }
  }

  async function find() {
    try {
      const response = await supabase.from('products').select('*')
      return response.data
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, searchById, searchByName, find }
}