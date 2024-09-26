import { Alert } from 'react-native'
import { useSQLiteContext } from "expo-sqlite"
import { IOrder } from '../utils/interface'

export function useOrderDatabase() {
  const database = useSQLiteContext()

  async function create(data: Omit<IOrder, 'id'>) {
    const statement = await database.prepareAsync(`
      INSERT INTO orders(client_name, product_name, amount, price, obs) 
      VALUES($client_name, $product_name, $amount, $price, $obs)`)
    try {
      const result = await statement.executeAsync({
        $client_name: data.client_name,
        $product_name: data.product_name,
        $amount: data.amount,
        $price: data.price,
        $obs: data.obs
      })
      const insertedRow = result.lastInsertRowId.toString()
      return { insertedRow }
    } catch (error) {
      throw error
    } finally {
      statement.finalizeAsync()
    }
  }

  async function update(data: IOrder) {
    const statement = await database.prepareAsync(`
      UPDATE orders SET client_name=$client_name, product_name=$product_name, amount=$amount, price=$price, obs=$obs 
      WHERE id=$id`)
    try {
      await statement.executeAsync({
        $id: data.id,
        $client_name: data.client_name,
        $product_name: data.product_name,
        $amount: data.amount,
        $price: data.price,
        $obs: data.obs
      })
    } catch (error) {
      throw error
    } finally{
      statement.finalizeAsync()
    }
  }

  async function remove(id: number) {
    try {
      await database.runAsync("DELETE FROM orders WHERE id=" + id)
      Alert.alert('Encomenda excluída com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function list() {
    try {
      const response = await database.getAllAsync<IOrder>("SELECT * FROM orders ORDER BY client_name, product_name")
      return response
    } catch (error) {
      throw error
    }
  }

  async function searchByName(name: string, type: string) {
    let query = "SELECT * FROM orders WHERE client_name LIKE ?"
    try {
      if(type === 'C') {
        const query = "SELECT * FROM orders WHERE client_name LIKE ?"
      } else {
        const query = "SELECT * FROM orders WHERE product_name LIKE ?"
      }
      const response = await database.getAllAsync<IOrder>(query, `%${name}%`)
      return response
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, list, searchByName }
}