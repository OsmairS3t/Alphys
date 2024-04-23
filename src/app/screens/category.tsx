import React from 'react';
import { InputForm } from '../components/Forms/InputForm';
import HeaderModal from '../components/HeaderModal';

import { Container, Title } from '../styles/categoryStyle';
import { ButtonForm, TextButton, TitleForm } from '../styles/global';

type CategoryProps = {
  closeModal: (value: boolean) => void;
}

export default function Category({ closeModal }: CategoryProps) {
  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='CADASTRO DE CATEGORIAS' />

      <TitleForm>NOVO CADASTRO:</TitleForm>
      <InputForm 
        placeholder='Nome da categoria'
      />
      
      <InputForm 
        placeholder='Nome do ícone'
      />

      <ButtonForm>
        <TextButton>Salvar</TextButton>
      </ButtonForm>
    </Container>
  )
}
