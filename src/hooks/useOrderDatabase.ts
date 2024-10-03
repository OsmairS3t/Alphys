import { Alert } from 'react-native'
import { IOrder } from '../utils/interface'
import { supabase } from '../databases/supabase'

export function useOrderDatabase() {

  async function create(data: Omit<IOrder, 'id'>) {
    try {
      const insertedRow = await supabase
        .from('orders')
        .insert({
          client_name: data.client_name,
          product_name: data.product_name,
          amount: data.amount,
          price: data.price,
          obs: data.obs
        })
        .select('id')
      return { insertedRow }
    } catch (error) {
      throw error
    }
  }

  async function update(data: IOrder) {
    try {
      await supabase
      .from('orders')
      .update({
        client_name: data.client_name,
        product_name: data.product_name,
        amount: data.amount,
        price: data.price,
        obs: data.obs
      })
      .eq('id', data.id)
    } catch (error) {
      throw error
    }
  }

  async function remove(id: number) {
    try {
      await supabase.from('orders').delete().eq('id', id)
      Alert.alert('Encomenda excluída com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function searchByName(name: string, type: string) {
    try {
      if(type === 'C') {
        const { data } = await supabase.from('orders').select('*').like('client_name', name)
        if(data) {
          return data
        }
      } else {
        const { data } = await supabase.from('orders').select('*').like('product_name', name)
        if(data) {
          return data
        }
      }
    } catch (error) {
      throw error
    }
  }

  async function find() {
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('client_name', {ascending: true})
        .order('product_name', {ascending: true})
      if(data) {
        return data
      }
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, searchByName, find }
}