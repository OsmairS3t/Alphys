import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useTheme } from 'styled-components';
import uuid from 'react-native-uuid';

import HeaderModal from '../components/HeaderModal';
import { InputForm } from '../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list'

import { IProduct, ISelectProps, IStock } from '../../utils/interface';
import { products, stocks } from '../../utils/database'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyStock } from '../../utils/keyStorage';

import { ButtonForm, TextButton } from '../styles/global';
import { Container, TitleModal } from '../styles/stockStyle';

type StockProps = {
  closeModal: (value: boolean) => void;
  codprod: string;
  amountprod: string;
}

export default function StockProducts({ closeModal, codprod, amountprod }: StockProps) {
  const theme = useTheme();
  const [selected, setSelected] = useState(codprod);
  const [amount, setAmount] = useState(amountprod);
  const [data, setData] = useState<ISelectProps[]>([]);

  function loadProducts(idProduct: string) {
    const product:IProduct | undefined = products.find(pro => pro.id === idProduct)
    return product
  }

  async function handleSave() {
    const loadProduct = loadProducts(selected)
    let name_product = ''
    if (loadProduct) {
      if (loadProduct.category) {
        name_product = loadProduct.category.name +' - '+ loadProduct.name
      } else {
        name_product = 'Sem categoria '+ loadProduct.name
      }
    }
    const n_amount = Number(amount)
    const data = {
      id: uuid.v4().toString(),
      codproduct: selected,
      product: name_product,
      amount: n_amount,
      hasStock: (n_amount > 0) ? true : false
    }
    try {
      const response = await AsyncStorage.getItem(keyStock)
      let oldData: IStock[] = response ? JSON.parse(response) : []

      oldData.push(data)

      await AsyncStorage.setItem(keyStock, JSON.stringify(oldData))
      Alert.alert('Produto incluído no estoque com sucesso!')
      setSelected('')
      setAmount('')
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(()=>{
    let newArray:ISelectProps[] = stocks.map(stock => {
      return {key: stock.id, value: stock.product}
    })
    setData(newArray)
  },[])

  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='CADASTRO DE ESTOQUE DE PRODUTOS' />

      <TitleModal>NOVO CADASTRO</TitleModal>
      <SelectList 
        placeholder='Informe o Produto'
        boxStyles={{backgroundColor: theme.colors.bg_input, marginBottom: 10}}
        dropdownStyles={{backgroundColor: theme.colors.bg_input}}
        setSelected={(selected:string) => setSelected(selected)} 
        data={data} 
        save="key"
      />

      <InputForm
        placeholder='Quantidade'
        keyboardType='numeric'
        onChangeText={text => setAmount(text)}
        value={amount}
      />

      <ButtonForm onPress={handleSave}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>
    </Container>
  )
}
