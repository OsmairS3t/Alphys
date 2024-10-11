import { Alert } from 'react-native'
import { supabase } from '../databases/supabase'
import { ITransaction } from '../utils/interface'

export function useTransactionDatabase() {

   async function create(data: Omit<ITransaction, 'id'>) {
    try {
      const insertedRow = await supabase
      .from('transactions')
      .insert({
        modality: data.modality,
        kind: data.kind,
        place: data.place,
        product_name: data.product_name,
        client_name: data.client_name,
        amount: data.amount,
        price: data.price,
        datetransaction: data.datetransaction,
        ispaid: data.ispaid
      })
      .select('id')
      return { insertedRow }
    } catch (error) {
      throw error
    }
  }

  async function update(data: ITransaction) {
    try {
      await supabase
        .from('transactions')
        .update({
          modality: data.modality,
          kind: data.kind,
          place: data.place,
          product_name: data.product_name,
          client_name: data.client_name,
          amount: data.amount,
          price: data.price,
          datetransaction: data.datetransaction,
          ispaid: data.ispaid
        })
        .eq('id', data.id)
    } catch (error) {
      throw error
    }
  }

  async function remove(id: number) {
    try {
      await supabase.from('transactions').delete().eq('id', id)
      Alert.alert('Transação (Compra/Venda) excluída com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function listByModality(modality: string) {
    try {
      const { data } = await supabase
        .from('transactions')
        .select('datetransaction, price')
        .eq('modality', modality)
        .eq('ispaid', true)
      if(data) {
        return data
      }
    } catch (error) {
      throw error
    }
  }

  async function searchById(id: number) {
    try {
      const { data } = await supabase.from('transactions').select('*').eq('id', id)
      if (data) {
        return data[0]
      }
    } catch (error) {
      throw error
    }
  }

  async function searchByModality(modality: string) {
    try {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('modality', modality)
        .order('client_name', { ascending: true })
        .order('product_name', { ascending: true })
      if(data) {
        return data
      }
    } catch (error) {
      throw error
    }
  }

  async function searchByClient(client_name: string) {
    try {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .like('client_name', client_name)
        .order('product_name', {ascending: true})
      if(data) {
        return data
      }
    } catch (error) {
      throw error
    }
  }

  async function searchByStock(stock_id: number) {
    try {
      const { data } = await supabase.from('transactions').select('*').eq('stock_id', stock_id)
      if(data) {
        return data
      }
    } catch (error) {
      throw error
    }
  }

  async function searchByProduct(product_name: string) {
    try {
      const { data } = await supabase.from('transactions').select('*').like('product_name', product_name)
      if(data) {
        return data
      }
    } catch (error) {
      throw error
    }
  }

  async function searchSalesPay(ispaid: boolean) {
    try {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('modality', 'sale')
        .eq('ispaid', ispaid)
      if(data) {
        return data
      }
    } catch (error) {
      throw error
    }
  }

  return { 
    create, 
    update, 
    remove, 
    searchById, 
    searchByModality, 
    listByModality,
    searchByClient, 
    searchByStock, 
    searchByProduct, 
    searchSalesPay }
}