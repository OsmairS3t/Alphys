import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { Container, Title } from '../styles/saleStyle';

type SaleProps = {
  closeModal: (value: boolean) => void;
}

export default function Sale({ closeModal }: SaleProps) {
  return (
    <Container>
      <Title>VENDAS</Title>
      <Pressable onPress={()=>closeModal(false)}>
        <Text>Fechar</Text>
      </Pressable>
    </Container>
  )
}
