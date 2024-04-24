import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';

import HeaderModal from '../components/HeaderModal';
import { InputForm } from '../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list'

import { ISelectProps } from '../../utils/interface';
import { stocks } from '../../utils/database'

import { ButtonForm, TextButton, TitleForm } from '../styles/global';
import { Container, Title } from '../styles/stockStyle';

type StockProps = {
  closeModal: (value: boolean) => void;
}

export default function StockProducts({ closeModal }: StockProps) {
  const theme = useTheme();
  const [selected, setSelected] = useState("");
  const [data, setData] = useState<ISelectProps[]>([]);

  useEffect(()=>{
    let newArray:ISelectProps[] = stocks.map(stock => {
      return {key: stock.id, value: stock.product}
    })
    setData(newArray)
  },[])

  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='CADASTRO DE ESTOQUE DE PRODUTOS' />

      <TitleForm>NOVO CADASTRO</TitleForm>
      <SelectList 
        boxStyles={{backgroundColor: theme.colors.bg_input, marginBottom: 10}}
        dropdownStyles={{backgroundColor: theme.colors.bg_input}}
        setSelected={(val:string) => setSelected(val)} 
        data={data} 
        save="key"
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
