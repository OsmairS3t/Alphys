import { Alert } from 'react-native'
import { useSQLiteContext } from "expo-sqlite"

export type CategoryDatabase = {
  id: number
  name: string
}

export function useCategoryDatabase() {
  const database = useSQLiteContext()

  async function create(data: Omit<CategoryDatabase, 'id'>) {
    const statement = await database.prepareAsync("INSERT INTO categories(name) VALUES($name)")

    try {
      const result = await statement.executeAsync({
        $name: data.name
      })
      const insertedRow = result.lastInsertRowId.toString()

      return { insertedRow }
    } catch (error) {
      throw error
    } finally {
      statement.finalizeAsync()
    }
  }

  async function searchByName(name: string) {
    try {
      const query = "SELECT * FROM categories WHERE name LIKE ?"
      const response = await database.getAllAsync<CategoryDatabase>(query, `%${name}%`)
      
      return response
    } catch (error) {
      throw error
    }
  }

  async function del(id: number) {
    try {
      await database.runAsync("DELETE FROM categories WHERE id=$id", { $id: id })
      Alert.alert('Categoria excluída com sucesso!')
    } catch (error) {
      throw error
    }
  }

  return { create, del, searchByName }
}