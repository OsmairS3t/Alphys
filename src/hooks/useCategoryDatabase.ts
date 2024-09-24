import { Alert } from 'react-native'
import { useSQLiteContext } from "expo-sqlite"
import { ICategory } from '../utils/interface'

export function useCategoryDatabase() {
  const database = useSQLiteContext()

  async function create(data: Omit<ICategory, 'id'>) {
    const statement = await database.prepareAsync("INSERT INTO categories(name) VALUES($name)")
    try {
      // if(isNaN(Number(amount))) {
      //   return Alert.alert('A quantidade deve ser um número')
      // }
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

  async function update(category: ICategory) {
    const statement = await database.prepareAsync("UPDATE categories SET name=$name WHERE id=$id")
    try {
      await statement.executeAsync({
        $id: category.id,
        $name: category.name
      })
    } catch (error) {
      throw error
    } finally{
      statement.finalizeAsync()
    }
  }

  async function remove(id: number) {
    //verificar se existe produto cadastrado nessa categoria antes
    try {
      await database.runAsync("DELETE FROM categories WHERE id=" + id)
      Alert.alert('Categoria excluída com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function findByName(name: string) {
    try {
      const response = await database.getFirstAsync<ICategory>("SELECT * FROM categories WHERE name=" + name)
      return response
    } catch (error) {
      throw error
    }
  }

  async function searchByName(name: string) {
    try {
      const query = "SELECT * FROM categories WHERE name LIKE ?"
      const response = await database.getAllAsync<ICategory>(query, `%${name}%`)
      return response
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, findByName, searchByName }
}