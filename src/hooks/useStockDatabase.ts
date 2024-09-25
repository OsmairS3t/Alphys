import { Alert } from 'react-native'
import { useSQLiteContext } from "expo-sqlite"
import { IStock } from '../utils/interface'

export function useStockDatabase() {
  const database = useSQLiteContext()

  async function create(data: Omit<IStock, 'id'>) {
    const statement = await database.prepareAsync("INSERT INTO stocks(product_id, product_name, amount, hasstock) VALUES($product_id, $product_name, $amount, $hasstock)")
    try {
      const result = await statement.executeAsync({
        $product_id: data.product_id,
        $product_name: data.product_name,
        $amount: data.amount,
        $hasstock: data.hasstock,
      })
      const insertedRow = result.lastInsertRowId.toString()
      return { insertedRow }
    } catch (error) {
      throw error
    } finally {
      statement.finalizeAsync()
    }
  }

  async function update(data: IStock) {
    const statement = await database.prepareAsync("UPDATE stocks SET product_id= $product_id, product_name=$product_name, amount=$amount, hasstock=$hasstock WHERE id=$id")
    try {
      await statement.executeAsync({
        $id: data.id,
        $product_id: data.product_id,
        $product_name: data.product_name,
        $amount: data.amount,
        $hasstock: data.hasstock
      })
    } catch (error) {
      throw error
    } finally{
      statement.finalizeAsync()
    }
  }

  async function remove(id: number) {
    //verificar se existe venda cadastrada pra esse cliente antes
    try {
      await database.runAsync("DELETE FROM stocks WHERE id=" + id)
      Alert.alert('Produto excluído do estoque com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function list() {
    try {
      const response = await database.getAllAsync<IStock>("SELECT * FROM stocks ORDER BY product_name;")
      return response
    } catch (error) {
      throw error      
    }
  }

  async function getStock(id: number) {
    try {
      const response = await database.getFirstAsync<IStock>("SELECT * FROM stocks WHERE id=" + id)
      return response
    } catch (error) {
      throw error
    }
  }

  async function searchByProductId(id: number) {
    try {
      const response = await database.getFirstAsync<IStock>("SELECT * FROM stocks WHERE product_id=" + id)
      return response
    } catch (error) {
      throw error
    }
  }

  async function searchByProduct(name: string) {
    try {
      const query = "SELECT * FROM stocks WHERE product_name LIKE ? ORDER BY product_name"
      const response = await database.getAllAsync<IStock>(query, `%${name}%`)
      return response
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, getStock, list, searchByProductId, searchByProduct }
}