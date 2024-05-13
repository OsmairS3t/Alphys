import React, { useState } from 'react';
import { Link } from 'expo-router';
import { useTheme } from 'styled-components';
import uuid from 'react-native-uuid';
import { Input } from './components/Forms/InputForm/styles';

import {
  ContainerSignIn,
  TitleForm,
  HeaderLogin,
  ImgLogoLogin,
  Form,
  ButtonSignIn,
  TextButtonSignIn,
  GroupLink,
  LinkScreen,
  TextLink
} from './styles/global';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyUser } from '../utils/keyStorage';
import { IUser } from '../utils/interface';
import { Alert } from 'react-native';

const NewUser: React.FC = () => {
  const theme = useTheme();
  const logo = '../assets/logo_alpys.png';
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  async function handleSave() {
    const dataUser = {
      email: String(email),
      name: String(name),
      password: String(password),
      password2: String(password2)
    }
    try {
      const response = await AsyncStorage.getItem(keyUser)
      const users: IUser[] = response ? JSON.parse(response) : []
      const foundUser = users.find(u => u.email === email)
      if (foundUser) {
        Alert.alert('Usuário já cadastrado!')
      } else {
        await AsyncStorage.setItem(keyUser, JSON.stringify(dataUser))
        Alert.alert('Usuário incluído com sucesso!')
      }
    } catch (error) {
      console.log(error)
    }
    console.log(dataUser)
  }

  return (
    <ContainerSignIn>
      <ImgLogoLogin source={require(logo)} />

      <Form>
        <TitleForm>Novo cadastro</TitleForm>
        <Input
          placeholder="E-mail"
          keyboardType="email-address"
          onChangeText={text => setEmail(text)}
          value={email}
        />

        <Input
          placeholder="Nome completo"
          keyboardType="default"
          onChangeText={text => setName(text)}
          value={name}
        />

        <Input
          placeholder="Senha"
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
          value={password}
        />

        <Input
          placeholder="Repita a Senha"
          secureTextEntry={true}
          onChangeText={text => setPassword2(text)}
          value={password2}
        />

        <ButtonSignIn onPress={handleSave}>
          <TextButtonSignIn>Entrar</TextButtonSignIn>
        </ButtonSignIn>

        <GroupLink>
          <LinkScreen href='/'>
            <TextLink>Voltar</TextLink>
          </LinkScreen>
        </GroupLink>
      </Form>
    </ContainerSignIn>
  )
}

export default NewUser;