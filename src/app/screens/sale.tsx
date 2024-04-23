import React from 'react';
import { View, Text, Pressable } from 'react-native';
import HeaderModal from '../components/HeaderModal';

import { Container } from '../styles/saleStyle';
import { TitleModal } from '../styles/global';

type SaleProps = {
  closeModal: (value: boolean) => void;
}

export default function Sale({ closeModal }: SaleProps) {
  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='CADASTRO DE VENDAS' />

      <TitleModal>NOVA VENDA</TitleModal>
      <Pressable onPress={()=>closeModal(false)}>
        <Text>Fechar</Text>
      </Pressable>
    </Container>
  )
}
