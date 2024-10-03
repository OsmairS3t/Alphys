import { Alert } from 'react-native'
import { supabase } from '../databases/supabase'
import { IClient } from '../utils/interface'

export function useClientDatabase() {

  async function create(data: Omit<IClient, 'id'>) {
    try {
      const insertedRow = await supabase
        .from('clients')
        .insert({
          name: data.name,
          photo: data.photo,
        })
        .select('id')
      return { insertedRow }
    } catch (error) {
      throw error
    }
  }

  async function update(data: IClient) {
    try {
      await supabase
        .from('clients')
        .update({
          name: data.name,
          photo: data.photo
        })
        .eq('id', data.id)
    } catch (error) {
      throw error
    }
  }

  async function remove(id: number) {
    try {
      await supabase.from('clients').delete().eq('id', id)
      Alert.alert('Cliente excluído com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function searchByName(name: string) {
    try {
      const {data} = await supabase.from('clients').select('*').like('name', name)
      if (data) {
        return data
      }
    } catch (error) {
      throw error
    }
  }

  async function searchById(id: number) {
    try {
      const {data} = await supabase.from('clients').select('*').eq('id', id)
      if (data) {
        return data[0]
      }
    } catch (error) {
      throw error
    }
  }
  
  async function find() {
    try {
      const {data} = await supabase.from('clients').select('*')
      if (data) {
        return data
      }
    } catch (error) {
      throw error
    }
  }
  
  return { create, update, remove, searchByName, searchById, find }
}