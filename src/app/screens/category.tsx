import React from 'react';
import { View, Text, Pressable } from 'react-native';

import { Container, Title } from '../styles/categoryStyle';

type CategoryProps = {
  closeModal: (value: boolean) => void;
}

export default function Category({ closeModal }: CategoryProps) {
  return (
    <Container>
      <Title>Categorias</Title>
      <Pressable onPress={()=>closeModal(false)}>
        <Text>Fechar</Text>
      </Pressable>
    </Container>
  )
}
