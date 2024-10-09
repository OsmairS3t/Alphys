import { Alert } from "react-native";
import { supabase } from "../databases/supabase";
import { IUser } from "../utils/interface";

type authUser = {
  email: string;
  password: string;
}

export function useUserDatabase() {
  
  async function create(data: Omit<IUser, 'id'>) {
    try {
      const insertedRow = await supabase
        .from('users')
        .insert({
          name: data.name,
          email: data.email,
          password: data.password
        })
        .select('id')
        return { insertedRow }
      } catch (error) {
      throw error
    }
  }

  async function update(data: IUser, type: string) {
    try {
      if(type === 'name') {
        await supabase.from('users').update({ name: data.name }).eq('id', data.id)
      }
      if(type === 'password') {
        await supabase.from('users').update({ password: data.password }).eq('id', data.id)
      }
      if(type === 'photo') {
        await supabase.from('users').update({ photo: data.photo }).eq('id', data.id)
      }
      if(type === 'all') {
        await supabase
          .from('users')
          .update({ 
            name: data.name,
            password: data.password,
            photo: data.photo 
          })
          .eq('id', data.id)
      }
    } catch (error) {
      throw error
    }
  }

  async function remove(id: number) {
    await supabase.from('users').delete().eq('id', id)
    Alert.alert('Usuário excluído do estoque com sucesso!')
  }

  async function authenticate(data: authUser) {
    try {
      const userAuth = await supabase
      .from('users')
      .select('*')
      .eq('email', data.email)
      .eq('password', data.password)
      if (userAuth.data) {
        if(userAuth.data.length === 0) {
          Alert.alert('E-mail ou senha inválidos.')
          return false
        } else {
          return userAuth.data[0]; 
        }
      } 
    } catch (error) {
      throw error      
    }
  }

  async function searchByEmail(email: string) {
    try {
      const { data } = await supabase.from('users').select('*').eq('email', email)
      if(data) {
        return data[0]
      } else {
        Alert.alert('Usuário não encontrado!')
      }
    } catch (error) {
      throw error
    }
  }

  return { create, update, remove, authenticate, searchByEmail}
}