import { Text } from "react-native";
import { Link, useRouter } from "expo-router";
import { useTheme } from "styled-components";
import { Input } from "./components/Forms/InputForm/styles";
import { useState } from "react";

import {
  ContainerSignIn,
  HeaderLogin,
  ImgLogoLogin,
  Form,
  ButtonSignIn,
  TextButtonSignIn,
  ImgCredit,
  GroupLink,
  LinkScreen,
  TextLink
} from './styles/global'

export default function Login() {
  const theme = useTheme()
  const logo = '../assets/logo_alpys.png';
  const imgCredit = '../assets/credit_dark.png';
  const router = useRouter();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleLogIn() {
    const dataUser = {
      email: email,
      password: password
    }
    // console.log(dataUser)
    router.replace('/(tabs)/transactions')
  }

  return (
    <ContainerSignIn>
      <HeaderLogin>
        <ImgLogoLogin source={require(logo)} />
        <Form>
          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            onChangeText={text => setEmail(text)}
            value={email}
          />

          <Input
            placeholder="Senha"
            secureTextEntry={true}
            onChangeText={text => setPassword(text)}
            value={password}
          />

          <ButtonSignIn onPress={handleLogIn}>
            <TextButtonSignIn>Entrar</TextButtonSignIn>
          </ButtonSignIn>
          <GroupLink>
            <LinkScreen href='./newuser'>
              <TextLink>Não tenho cadastro</TextLink>
            </LinkScreen>
            <TextLink>|</TextLink>
            <LinkScreen href='./esquecisenha'>
              <TextLink>Esqueci a senha</TextLink>
            </LinkScreen>
          </GroupLink>
        </Form>
      </HeaderLogin>
      <ImgCredit source={require(imgCredit)} />
    </ContainerSignIn>
  )
}