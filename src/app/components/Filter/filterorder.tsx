import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import HeaderModal from '../HeaderModal';
import { InputForm } from '../Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list'
import { ISelectProps } from '../../../utils/interface';
import { ButtonForm, TextButton } from '../../styles/global';
import { Container, Title } from '../../styles/stockStyle';

type StockProps = {
  closeModal: (value: boolean) => void;
  setFilterType: (value: string) => void;
  setFilterSearch: (value: string) => void;
}

export default function FilterOrder({ closeModal, setFilterType, setFilterSearch }: StockProps) {
  const theme = useTheme();
  const [selectedFilter, setSelectedFilter] = useState("");
  const [search, setSearch] = useState('')
  const dataChosed = useState<ISelectProps[]>([
    { key: 'C', value: 'CLIENTES' },
    { key: 'P', value: 'PRODUTOS' },
  ]);

  async function handleFilter() {
    setFilterType(selectedFilter)
    setFilterSearch(search)
    closeModal(false)
  }

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='FILTRAR ENCOMENDAS' />

      <Title>INFORME:</Title>
      <SelectList
        placeholder='Tipo de filtro'
        boxStyles={{ backgroundColor: theme.colors.bg_input, marginBottom: 10 }}
        dropdownStyles={{ backgroundColor: theme.colors.bg_input }}
        setSelected={(val: string) => setSelectedFilter(val)}
        data={dataChosed}
        save="key"
      />

      <InputForm
        placeholder='Nome'
        keyboardType='default'
        onChangeText={text => setSearch(text)}
        value={search}
      />

      <ButtonForm onPress={handleFilter}>
        <TextButton>Enviar Filtro</TextButton>
      </ButtonForm>
    </Container>
  )
}
