import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  function handleLogIn() {
    router.replace('/(tabs)/register')
  }

  return (
    <View>
      <Text>Log In</Text>
      <Pressable onPress={handleLogIn}>
        <Text>Entrar</Text>
      </Pressable>
    </View>
  )
}