import React from 'react';
import { View, Text, Pressable } from 'react-native';
import HeaderModal from '../components/HeaderModal';

import { Container, Title } from '../styles/clientStyle';
import { TitleForm } from '../styles/global';

type ClientProps = {
  closeModal: (value: boolean) => void;
}

export default function Client({ closeModal }: ClientProps) {
  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='CADASTRO DE CLIENTES' />

      <TitleForm>NOVO CADASTRO:</TitleForm>
       <Pressable onPress={()=>closeModal(false)}>
        <Text>Fechar</Text>
      </Pressable>
    </Container>
  )
}
