import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { ContainerHeader, ContainerImgHeader, ImgLogoHeader, IconSignOut } from '../styles/global';

export default function Header() {
  const router = useRouter()

  function handleLogOut() {
    router.replace('/')
  }

  const logo = '../../assets/logo_alpys.png';

  return (
    <ContainerHeader>
      <ContainerImgHeader>
        <ImgLogoHeader source={require(logo)} />
      </ContainerImgHeader>
      <Pressable onPress={handleLogOut}>
        <IconSignOut name='log-out' />
      </Pressable>
    </ContainerHeader>
  )
}
