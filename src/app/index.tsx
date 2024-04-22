import { Pressable } from "react-native";
import { useRouter } from "expo-router";

import { Container, LabelForm, ButtonSignIn, TextButton } from './styles/global'

export default function Login() {
  const router = useRouter();

  function handleLogIn() {
    router.replace('/(tabs)/transactions')
  }

  return (
    <Container>
      <LabelForm>Log In</LabelForm>
      <ButtonSignIn onPress={handleLogIn}>
        <TextButton>Entrar</TextButton>
      </ButtonSignIn>
    </Container>
  )
}