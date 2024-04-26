import React, { useState } from 'react';
import { useTheme } from 'styled-components';

import HeaderModal from '../components/HeaderModal';
import { InputForm } from '../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list'

import { ISelectProps } from '../../utils/interface';

import { ButtonForm, TextButton } from '../styles/global';
import { Container, Title } from '../styles/stockStyle';

type StockProps = {
  closeModal: (value: boolean) => void;
}

export default function FilterStock({ closeModal }: StockProps) {
  const theme = useTheme();
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState('')
  const [data, setData] = useState<ISelectProps[]>([
    { key: 'idcategory', value: 'Categoria' },
    { key: 'idproduct', value: 'Produto' },
  ]);
  
  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='FILTRAR LISTA DE PRODUTOS' />

      <Title>INFORME:</Title>
      <SelectList 
        placeholder='Tipo de filtro'
        boxStyles={{backgroundColor: theme.colors.bg_input, marginBottom: 10}}
        dropdownStyles={{backgroundColor: theme.colors.bg_input}}
        setSelected={(val:string) => setSelected(val)} 
        data={data} 
        save="key"
      />
      
      <InputForm 
        placeholder='Valor a localizar'
        onChangeText={text => setSearch(text)}
        value={search}
      />

      <ButtonForm>
        <TextButton>Salvar</TextButton>
      </ButtonForm>
    </Container>
  )
}
