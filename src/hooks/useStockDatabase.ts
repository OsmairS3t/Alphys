import { Alert } from 'react-native'
import { supabase } from '../databases/supabase'
import { IStock } from '../utils/interface'

export function useStockDatabase() {

  async function create(data: Omit<IStock, 'id'>) {
    try {
      const insertedRow = await supabase
        .from('stocks')
        .insert({
          product_id: data.product_id,
          product_name: data.product_name,
          amount: data.amount,
          hasstock: data.hasstock,
        })
        .select('id')
      return { insertedRow }
    } catch (error) {
      throw error
    }
  }

  async function update(data: IStock) {
    try {
      await supabase
        .from('stocks')
        .update({
          product_id: data.product_id,
          product_name: data.product_name,
          amount: data.amount,
          hasstock: data.hasstock
        })
        .eq('id', data.id)
    } catch (error) {
      throw error
    }
  }

  async function remove(id: number) {
    try {
      await supabase.from('stocks').delete().eq('id', id)
      Alert.alert('Produto excluído do estoque com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function searchById(id: number) {
    try {
      const { data } = await supabase.from('stocks').select('*').eq('id', id)
      if(data) {
        return data[0]
      }
    } catch (error) {
      throw error
    }
  }

  async function searchByProductId(id: number) {
    try {
      const { data } = await supabase.from('stocks').select('*').eq('id', id)
      if (data) {
        return data[0]
      }
    } catch (error) {
      throw error
    }
  }

  async function searchByProduct(name: string) {
    try {
      const { data } = await supabase
      .from('stocks')
      .select('*')
      .like('product_name', name)
      if (data) {
        return data
      }
    } catch (error) {
      throw error
    }
  }

  async function find() {
    try {
      const { data } = await supabase.from('stocks').select('*').order('product_name', {ascending: true})
      if (data) {
        return data
      }
    } catch (error) {
      throw error      
    }
  }

  return { create, update, remove, searchById, searchByProductId, searchByProduct, find }
}