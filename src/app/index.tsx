import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function Login() {
  const router = useRouter();

  function handleLogIn() {
    router.replace('/(tabs)/product')
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text>Log In</Text>
      <Pressable
        onPress={handleLogIn}
        style={{
          width: '100%',
          marginTop: 10,
          padding: 10,
          borderRadius: 10,
          backgroundColor: '#f4511e',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{ fontSize: 18, color: '#ffffff' }}>Entrar</Text>
      </Pressable>
    </View>
  )
}