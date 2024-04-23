import React from 'react';
import { Text, Pressable } from 'react-native';
import HeaderModal from '../components/HeaderModal';

import { Container, Title } from '../styles/buyStyle';
import { TitleForm } from '../styles/global';

type BuyProps = {
  closeModal: (value: boolean) => void;
}

export default function Buy({ closeModal }: BuyProps) {
  return (
    <Container>
       <HeaderModal closeModal={()=>closeModal(false)} titleModal='CADASTRO DE COMPRAS' />

      <TitleForm>NOVO CADASTRO:</TitleForm>
      <Pressable onPress={()=>closeModal(false)}>
        <Text>Fechar</Text>
      </Pressable>
    </Container>
  )
}
