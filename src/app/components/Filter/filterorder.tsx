import React, { useState } from 'react';
import { useTheme } from 'styled-components';

import HeaderModal from '../HeaderModal';
import { InputForm } from '../Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list'

import { ICategory, IClient, IOrder, IProduct, ISelectProps } from '../../../utils/interface';

import { ButtonForm, TextButton } from '../../styles/global';
import { Container, Title } from '../../styles/stockStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyClient, keyOrder } from '../../../utils/keyStorage';

type StockProps = {
  closeModal: (value: boolean) => void;
  setFilterType: (value: string) => void;
  setFilterId: (value: string) => void;
}

export default function FilterOrder({ closeModal, setFilterType, setFilterId }: StockProps) {
  const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [selectedClientProduct, setSelectedClientProduct] = useState("");
  const [dataFiltered, setDataFiltered] = useState([{ key: 'idclient', value: 'Cliente' }])
  const [dataChosed, setDataChosed] = useState<ISelectProps[]>([
    { key: 'idclient', value: 'Cliente' },
    { key: 'idproduct', value: 'Produto' },
  ]);
  
  async function loadFilter(id: string) {
    const response = await AsyncStorage.getItem(keyOrder)
    const arrayOrder: IOrder[] = response ? JSON.parse(response) : []
    if (id==='idclient') {
      const arrayClient: IClient[] = arrayOrder.map(arrOrd => {
        return {
          id: String(arrOrd.client?.id),
          name: String(arrOrd.client?.name),
          photo: String(arrOrd.client?.photo),
        }
      })
      let newArray: ISelectProps[] = arrayClient.map(cli => {
        return { key: String(cli.id), value: String(cli.name) }
      })
      setDataFiltered(newArray)
    }

    if (id==='idproduct') {
      const arrayProduct: IProduct[] = arrayOrder.map(arrOrd => {
        return {
          id: String(arrOrd.product?.id),
          category: arrOrd.product?.category,
          name: String(arrOrd.product?.name),
          price: Number(arrOrd.product?.price),
          photo: String(arrOrd.product?.photo),
        }
      })
      let newArray: ISelectProps[] = arrayProduct.map(pro => {
        return { key: String(pro.id), value: String(pro.category?.name) +' - '+ String(pro.name) }
      })
      setDataFiltered(newArray)
    }
  }

  function handleFilter() {
    setFilterType(selectedFilter)
    setFilterId(selectedClientProduct)
    closeModal(false)
  }

  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='FILTRAR ENCOMENDAS' />

      <Title>INFORME:</Title>
      <SelectList 
        placeholder='Tipo de filtro'
        boxStyles={{backgroundColor: theme.colors.bg_input, marginBottom: 10}}
        dropdownStyles={{backgroundColor: theme.colors.bg_input}}
        setSelected={(val:string) => setSelectedFilter(val)} 
        data={dataChosed} 
        save="key"
        onSelect={() => loadFilter(selectedFilter)}
      />
      
      <SelectList 
        placeholder='Selecione...'
        boxStyles={{backgroundColor: theme.colors.bg_input, marginBottom: 10}}
        dropdownStyles={{backgroundColor: theme.colors.bg_input}}
        setSelected={(val:string) => setSelectedClientProduct(val)} 
        data={dataFiltered} 
        save="key"
      />
      
      <ButtonForm onPress={handleFilter}>
        <TextButton>Enviar Filtro</TextButton>
      </ButtonForm>
    </Container>
  )
}
