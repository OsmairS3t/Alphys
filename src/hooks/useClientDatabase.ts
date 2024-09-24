import { Alert } from 'react-native'
import { useSQLiteContext } from "expo-sqlite"
import { IClient } from '../utils/interface'

export function useClientDatabase() {
  const database = useSQLiteContext()

  async function create(data: Omit<IClient, 'id'>) {
    const statement = await database.prepareAsync("INSERT INTO clients(name, photo) VALUES($name, $photo)")
    try {
      const result = await statement.executeAsync({
        $name: data.name,
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

  async function update(data: IClient) {
    const statement = await database.prepareAsync("UPDATE clients SET name=$name, photo=$photo WHERE id=$id")
    try {
      await statement.executeAsync({
        $id: data.id,
        $name: data.name,
        $photo: data.photo
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
      await database.runAsync("DELETE FROM clients WHERE id=" + id)
      Alert.alert('Cliente excluído com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function searchByName(name: string) {
    try {
      const query = "SELECT * FROM clients WHERE name LIKE ?"
      const response = await database.getAllAsync<IClient>(query, `%${name}%`)
      return response
    } catch (error) {
      throw error
    }
  }
  async function searchById(id: number) {
    try {
      const response = await database.getFirstAsync<IClient>("SELECT * FROM clients WHERE id=" + id)
      return response
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, searchByName, searchById }
}