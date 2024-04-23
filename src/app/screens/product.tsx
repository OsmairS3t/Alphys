import React from 'react';
import { View, Text, Pressable } from 'react-native';
import HeaderModal from '../components/HeaderModal';

import { Container } from '../styles/productStyle';
import { TitleModal } from '../styles/global';

type ProductProps = {
  closeModal: (value: boolean) => void;
}

export default function Product({ closeModal }: ProductProps) {
  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='CADASTRO DE PRODUTOS' />

      <TitleModal>NOVO CADASTRO</TitleModal>
      <Pressable onPress={()=>closeModal(false)}>
        <Text>Fechar</Text>
      </Pressable>
    </Container>
  )
}
