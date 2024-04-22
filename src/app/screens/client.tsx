import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { Container, Title } from '../styles/clientStyle';

type ClientProps = {
  closeModal: (value: boolean) => void;
}

export default function Client({ closeModal }: ClientProps) {
  return (
    <Container>
      <Title>CLIENTES</Title>
      <Pressable onPress={()=>closeModal(false)}>
        <Text>Fechar</Text>
      </Pressable>
    </Container>
  )
}
