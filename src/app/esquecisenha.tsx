import React, { useState } from 'react';
import { Link } from 'expo-router';
import { useTheme } from 'styled-components';
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
import { useUserDatabase } from '../hooks/useUserDatabase';
import { IUser } from '../utils/interface';
import { Alert } from 'react-native';

const ForgotPassword: React.FC = () => {
  const theme = useTheme();
  const userDatabase = useUserDatabase()
  const logo = '../assets/logo_alpys.png';
  const [email, setEmail] = useState('')

  async function handleRemember() {
    const user:IUser = await userDatabase.searchByEmail(email)
    if(user) {
      Alert.alert('Sua senha de acesso é: ', user.password)
    }
  }

  return (
    <ContainerSignIn>
      <ImgLogoLogin source={require(logo)} />

      <Form>
        <TitleForm>Informe seu e-mail:</TitleForm>
        <Input
          placeholder="E-mail"
          keyboardType="email-address"
          onChangeText={text => setEmail(text)}
          value={email}
        />

        <ButtonSignIn onPress={handleRemember}>
          <TextButtonSignIn>Enviar e-mail</TextButtonSignIn>
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

export default ForgotPassword;