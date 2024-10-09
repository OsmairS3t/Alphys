import React from 'react';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { ContainerHeader, ContainerImgHeader, ImgLogoHeader, IconSignOut, IconUser } from './styles/global';

export default function Header() {
  const router = useRouter()

  function handleLogOut() {
    router.replace('/')
  }

  function handleUser() {
    router.push('/screens/profile')
  }

  const logo = '../assets/logo_alpys.png';

  return (
    <ContainerHeader>
      <Pressable onPress={handleUser}>
        <IconUser name='user' />
      </Pressable>
      <ContainerImgHeader>
        <ImgLogoHeader source={require(logo)} />
      </ContainerImgHeader>
      <Pressable onPress={handleLogOut}>
        <IconSignOut name='log-out' />
      </Pressable>
    </ContainerHeader>
  )
}
