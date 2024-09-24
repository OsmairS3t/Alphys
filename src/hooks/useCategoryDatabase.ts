import { Alert } from 'react-native'
import { useSQLiteContext } from "expo-sqlite"
import { ICategory } from '../utils/interface'

export function useCategoryDatabase() {
  const database = useSQLiteContext()

  async function create(data: Omit<ICategory, 'id'>) {
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

  async function update(category: ICategory) {
    try {
      await database
        .runAsync('UPDATE FROM categories SET name=$name WHERE id=$id', 
          { 
            $name: category.name, 
            $id: category.id 
          }
        )
    } catch (error) {
      throw error
    }
  }

  async function searchById(id: number) {
    try {
      const query = "SELECT * FROM categories WHERE id=?"
      const response = await database.getFirstAsync<ICategory>(query, `%${id}%`)
      if(response) {
        return response
      }
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

  
  async function del(id: number) {
    //verificar se existe produto cadastrado nessa categoria antes
    try {
      await database.runAsync("DELETE FROM categories WHERE id=$id", { $id: id })
      Alert.alert('Categoria excluída com sucesso!')
    } catch (error) {
      throw error
    }
  }

  return { create, del, searchById, searchByName }
}