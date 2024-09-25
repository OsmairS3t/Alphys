import { Alert } from 'react-native'
import { useSQLiteContext } from "expo-sqlite"
import { ITransaction } from '../utils/interface'

export function useTransactionDatabase() {
  const database = useSQLiteContext()

   async function create(data: Omit<ITransaction, 'id'>) {
    const statement = await database.prepareAsync(`
      INSERT INTO transactions(modality, kind, place, product_name, client_name, amount, price, datetransaction, ispaid) 
      VALUES($modality, $kind, $place, $product_name, $client_name, $amount, $price, $datetransaction, $ispaid)`)
    try {
      const result = await statement.executeAsync({
        $modality: data.modality,
        $kind: data.kind,
        $place: data.place,
        $product_name: data.product_name,
        $client_name: data.client_name,
        $amount: data.amount,
        $price: data.price,
        $datetransaction: data.datetransaction,
        $ispaid: data.ispaid
      })
      const insertedRow = result.lastInsertRowId.toString()
      return { insertedRow }
    } catch (error) {
      throw error
    } finally {
      statement.finalizeAsync()
    }
  }

  async function update(data: ITransaction) {
    const statement = await database.prepareAsync(`
      UPDATE transactions SET modality=$modality, kind=$kind, place=$place, 
      product_name=$product_name, client_name=$client_name, amount, 
      price=$price, datetransaction=$datetransaction, ispaid=$ispaid 
      WHERE id=$id`)
    try {
      await statement.executeAsync({
        $id: data.id,
        $modality: data.modality,
        $kind: data.kind,
        $place: data.place,
        $product_name: data.product_name,
        $client_name: data.client_name,
        $amount: data.amount,
        $price: data.price,
        $datetransaction: data.datetransaction,
        $ispaid: data.ispaid
      })
    } catch (error) {
      throw error
    } finally{
      statement.finalizeAsync()
    }
  }

  async function remove(id: number) {
    try {
      await database.runAsync("DELETE FROM transactions WHERE id=" + id)
      Alert.alert('Transação (Compra/Venda) excluída com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function searchById(id: number) {
    try {
      const response = await database.getFirstAsync<ITransaction>("SELECT * FROM transactions WHERE id="+ id)
      return response
    } catch (error) {
      throw error
    }
  }

  async function searchByModality(modality: string) {
    try {
      const query = "SELECT * FROM transactions WHERE modality LIKE ? ORDER BY client_name, product_name"
      const response = await database.getAllAsync<ITransaction>(query, `%${modality}%`)
      return response
    } catch (error) {
      throw error
    }
  }

  async function searchByClient(client_name: string) {
    try {
      const response = await database.getFirstAsync<ITransaction>("SELECT * FROM transactions WHERE client_name=" + client_name)
      return response
    } catch (error) {
      throw error
    }
  }

  async function searchByStock(stock_id: number) {
    try {
      const response = await database.getAllAsync<ITransaction>("SELECT * FROM transactions WHERE stock_id=" + stock_id)
      return response
    } catch (error) {
      throw error
    }
  }

  async function searchByProduct(product_name: string) {
    try {
      const response = await database.getFirstAsync("SELECT * FROM transactions WHERE product_name=" + product_name)
      return response
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, searchById, searchByModality, searchByClient, searchByStock, searchByProduct }
}