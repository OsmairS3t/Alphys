import React from 'react';

import { HeaderContainerModaL, ButtonCloseModal, TextButtonModal, TitleModal } from '../../styles/global';

interface Props {
  closeModal: (value: boolean) => void;
  titleModal: string;
}

export default function HeaderModal({closeModal, titleModal}: Props) {
  return (
  <HeaderContainerModaL>
    <TitleModal>{titleModal}</TitleModal>
    <ButtonCloseModal onPress={()=>closeModal(false)}>
      <TextButtonModal>X</TextButtonModal>
    </ButtonCloseModal>
  </HeaderContainerModaL>    
  )
}

