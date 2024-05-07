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

const ForgotPassword: React.FC = () => {
  const theme = useTheme();
  const logo = '../assets/logo_alpys.png';
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')

  async function handleRemember() {
    const dataUser = {
      email: email,
    }
    console.log(dataUser)
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