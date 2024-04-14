import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

export default function Header() {
  const router = useRouter()

  function handleLogOut() {
    router.replace('/')
  }

  return (
    <View
      style={{
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f4511e'
      }}
    >
      <View
        style={{
          width: '80%',
          alignItems: 'center'
        }}
      >
        <Text>HEADER</Text>
      </View>
      <Pressable onPress={handleLogOut}>
        <Text>Sair</Text>
      </Pressable>
    </View>
  )
}
