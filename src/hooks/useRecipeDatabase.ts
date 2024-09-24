import { Alert } from 'react-native'
import { useSQLiteContext } from "expo-sqlite"
import { IRecipe } from '../utils/interface'

export function useRecipeDatabase() {
  const database = useSQLiteContext()

  async function create(data: Omit<IRecipe, 'id'>) {
    const statement = await database.prepareAsync(`
      INSERT INTO recipes(nameproduct, preparation, cooking, ingredients) 
      VALUES($nameproduct, $preparation, $cooking, $ingredients)`)
    try {
      const result = await statement.executeAsync({
        $nameproduct: data.nameproduct,
        $preparation: data.preparation,
        $cooking: data.cooking,
        $ingredients: JSON.stringify(data.ingredients)
      })
      const insertedRow = result.lastInsertRowId.toString()
      return { insertedRow }
    } catch (error) {
      throw error
    } finally {
      statement.finalizeAsync()
    }
  }

  async function update(data: IRecipe) {
    const statement = await database.prepareAsync("UPDATE recipes SET nameproduct=$nameproduct, preparation=$preparation, cooking=$cooking WHERE id=$id")
    try {
      await statement.executeAsync({
        $id: data.id,
        $nameproduct: data.nameproduct,
        $preparation: data.preparation,
        $cooking: data.cooking,
        $ingredients: JSON.stringify(data.ingredients)
      })
    } catch (error) {
      throw error
    } finally{
      statement.finalizeAsync()
    }
  }

  async function remove(id: number) {
    try {
      await database.runAsync("DELETE FROM recipes WHERE id=" + id)
      Alert.alert('Receita excluída com sucesso!')
    } catch (error) {
      throw error
    }
  }

  async function searchByName(name: string) {
    try {
      const query = "SELECT * FROM recipes WHERE nameproduct LIKE ?"
      const response = await database.getAllAsync<IRecipe>(query, `%${name}%`)
      return response
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, searchByName }
}