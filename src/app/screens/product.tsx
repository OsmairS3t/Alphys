import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { Container, Title } from '../styles/productStyle';

type ProductProps = {
  closeModal: (value: boolean) => void;
}

export default function Product({ closeModal }: ProductProps) {
  return (
    <Container>
      <Title>PRODUCT</Title>
      <Pressable onPress={()=>closeModal(false)}>
        <Text>Fechar</Text>
      </Pressable>
    </Container>
  )
}
