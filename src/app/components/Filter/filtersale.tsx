import React from 'react';
import { Switch } from 'react-native';

import HeaderModal from '../HeaderModal';

import { ButtonForm, TextButton } from '../../styles/global';
import { Container } from '../../styles/stockStyle';
import {GroupSwitch, TitleSwitch, TextSwitch} from '../../styles/saleStyle'

type SaleProps = {
  closeModal: (value: boolean) => void;
  setStatusPay: (value: boolean) => void;
  status: boolean;
}

export default function FilterSale({ closeModal, setStatusPay, status }: SaleProps) {
  
  async function loadFilter() {
    closeModal(false)
  }

  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='FILTRAR VENDAS' />

      <TitleSwitch>INFORME FILTRO PARA LISTAR:</TitleSwitch>
      <GroupSwitch>
        <Switch
          style={{ width: 50 }}
          trackColor={{ false: '#c4c4c4', true: '#c4c4c4' }}
          thumbColor={status ? '#018597' : '#f35e5e'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setStatusPay}
          value={status}
        />
        <TextSwitch isPaid={status}>{status ? 'Pagos' : 'A pagar'}</TextSwitch>
      </GroupSwitch>

      <ButtonForm onPress={loadFilter}>
        <TextButton>Enviar Filtro</TextButton>
      </ButtonForm>
    </Container>
  )
}
