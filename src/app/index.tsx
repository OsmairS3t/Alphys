import { Pressable } from "react-native";
import { useRouter } from "expo-router";

import {
  ContainerSignIn,
  HeaderLogin,
  ImgLogoLogin,
  Form,
  ButtonSignIn,
  TextButtonSignIn,
  ImgCredit
} from './styles/global'
import { Input } from "./components/Forms/InputForm/styles";

export default function Login() {
  const router = useRouter();
  const logo = '../assets/logo_alpys.png';
  const imgCredit = '../assets/credit_dark.png';

  function handleLogIn() {
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
          />

          <Input
            placeholder="Senha"
            keyboardType="visible-password"
          />

          <ButtonSignIn onPress={handleLogIn}>
            <TextButtonSignIn>Entrar</TextButtonSignIn>
          </ButtonSignIn>
        </Form>
      </HeaderLogin>
      <ImgCredit source={require(imgCredit)} />
    </ContainerSignIn>
  )
}