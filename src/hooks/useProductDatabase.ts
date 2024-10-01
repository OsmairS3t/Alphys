import { Alert } from 'react-native'
import { useSQLiteContext } from "expo-sqlite"
import { IProduct } from '../utils/interface'

export function useProductDatabase() {
  const database = useSQLiteContext()

  async function create(data: Omit<IProduct, 'id'>) {
    const statement = await database.prepareAsync("INSERT INTO products(categoryname, name, price, photo) VALUES($categoryname, $name, $price, $photo)")
    try {
      const result = await statement.executeAsync({
        $categoryname: data.categoryname,
        $name: data.name,
        $price: data.price,
        $photo: data.photo,
      })
      const insertedRow = result.lastInsertRowId.toString()
      return { insertedRow }
    } catch (error) {
      throw error
    } finally {
      statement.finalizeAsync()
    }
  }

  async function update(data: IProduct) {
    const statement = await database.prepareAsync("UPDATE products SET categoryname=$categoryname, name=$name, price=$price, photo=$photo WHERE id=$id")
    try {
      await statement.executeAsync({
        $id: data.id,
        $categoryname: data.categoryname,
        $name: data.name,
        $price: data.price,
        $photo: data.photo
      })
    } catch (error) {
      throw error
    } finally{
      statement.finalizeAsync()
    }
  }

  async function remove(id: number) {
    try {
      await database.runAsync("DELETE FROM products WHERE id=" + id)
      Alert.alert('Produto excluído com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function searchById(id: number) {
    try {
      const response = await database.getFirstAsync<IProduct>("SELECT * FROM products WHERE id=" + id)
      return response
    } catch (error) {
      throw error
    }
  }

  async function searchByName(name: string) {
    try {
      const query = "SELECT * FROM products WHERE name LIKE ?"
      const response = await database.getAllAsync<IProduct>(query, `%${name}%`)
      return response
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, searchById, searchByName }
}