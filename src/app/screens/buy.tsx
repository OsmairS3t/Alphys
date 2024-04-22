import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { Container, Title } from '../styles/buyStyle';

type BuyProps = {
  closeModal: (value: boolean) => void;
}

export default function Buy({ closeModal }: BuyProps) {
  return (
    <Container>
      <Title>COMPRAS</Title>
      <Pressable onPress={()=>closeModal(false)}>
        <Text>Fechar</Text>
      </Pressable>
    </Container>
  )
}
