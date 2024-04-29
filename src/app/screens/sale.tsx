import React, { useEffect, useState } from 'react';
import { Alert, Switch } from 'react-native';
import { useTheme } from 'styled-components';
import HeaderModal from '../components/HeaderModal';

import { IClient, IProduct, ISale, ISelectProps, IStock } from '../../utils/interface';
import { clients, products } from '../../utils/database';
import uuid from 'react-native-uuid';
import { InputForm } from '../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list';

import { Container, Title, GroupSwitch, TitleSwitch, TextSwitch } from '../styles/saleStyle';
import { ButtonForm, TextButton, InputMask } from '../styles/global';
import { keyClient, keySale, keyStock } from '../../utils/keyStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { actualDate } from '../../utils/functions';

type SaleProps = {
  closeModal: (value: boolean) => void;
}

export default function Sale({ closeModal }: SaleProps) {
  const theme = useTheme();
  const [dataClient, setDataClient] = useState<ISelectProps[]>([]);
  const [selectedClient, setSelectedClient] = useState("")
  const [dataProduct, setDataProduct] = useState<ISelectProps[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("")
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  
  function loadClients(idClient: string) {
    const client:IClient | undefined = clients.find(cli => cli.id === idClient)
    return client
  }
  
  function loadProducts(idProduct: string) {
    const product:IProduct | undefined = products.find(pro => pro.id === idProduct)
    return product
  }

  async function handleSave() {
    const result = await AsyncStorage.getItem(keyStock)
    const dataStock: IStock[] = result ? JSON.parse(result) : []
    const stockFound = dataStock.find(de => de.codproduct === selectedProduct)
    let stockUpdate = dataStock.filter(de => de.codproduct !== selectedProduct)
    if(Number(amount) > Number(stockFound?.amount)) {
      Alert.alert('Não há quantidade disponível para este produto.')
      return false;
    } else {
      const newAmount = Number(stockFound?.amount) - Number(amount)
      let idProduct=''
      let nameProduct=''
      if(stockFound) {
        idProduct = stockFound.id
        nameProduct = stockFound.product
      }
      const dataNewStock = {
        id: idProduct,
        codproduct: selectedProduct,
        product: nameProduct,
        amount: newAmount,
        hasStock: newAmount > 0 ? true : false
      }
      stockUpdate.push(dataNewStock)
    }
    const data = {
      id: uuid.v4().toString(),
      client: loadClients(selectedClient),
      product: loadProducts(selectedProduct),
      amount: Number(amount),
      price: Number(price),
      isPaid: isPaid,
      dateSale: actualDate()
  }
    try {
      const response = await AsyncStorage.getItem(keySale)
      let oldData: ISale[] = response ? JSON.parse(response) : []

      oldData.push(data)

      await AsyncStorage.setItem(keyStock, JSON.stringify(stockUpdate))
      await AsyncStorage.setItem(keyClient, JSON.stringify(oldData))
      Alert.alert('Venda incluída com sucesso!')
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
    console.log(data)
  }
  
  useEffect(()=>{
    let newArrayClient:ISelectProps[] = clients.map(cli => {
      return {key: cli.id, value: cli.name}
    })
    let newArrayProduct:ISelectProps[] = products.map(pro => {
      return {key: pro.id, value: pro.category.name +' - '+ pro.name}
    })
    setDataClient(newArrayClient)
    setDataProduct(newArrayProduct)
  },[])

  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='CADASTRO DE VENDAS' />

      <Title>NOVA VENDA</Title>
      <SelectList 
        placeholder='Cliente'
        boxStyles={{ backgroundColor: theme.colors.bg_input, marginBottom: 10}}
        dropdownStyles={{backgroundColor: theme.colors.bg_input}}
        setSelected={(val:string) => setSelectedClient(val)} 
        data={dataClient} 
        save="key"
      />

      <SelectList 
        placeholder='Produto'
        boxStyles={{backgroundColor: theme.colors.bg_input, marginBottom: 10}}
        dropdownStyles={{backgroundColor: theme.colors.bg_input}}
        setSelected={(val:string) => setSelectedProduct(val)} 
        data={dataProduct} 
        save="key"
      />
      
      <InputForm 
        placeholder='Quantidade'
        keyboardType='numeric'
        onChangeText={text => setAmount(text)}
        value={amount}
      />
      
      <InputMask
        type='currency'
        options={{
          prefix: '',
          precision: 2,
          decimalSeparator: '.',
          groupSeparator: ',',
        }}
        placeholder='0.00'
        keyboardType='numeric'
        onChangeText={(text, rawText) => {
          setPrice(text)
        }}
      />

      <GroupSwitch>
        <TitleSwitch>Situação:</TitleSwitch>
        <Switch
          style={{width: 50}} 
          trackColor={{false: '#c4c4c4', true: '#c4c4c4'}}
          thumbColor={isPaid ? '#018597' : '#f35e5e'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setIsPaid}
          value={isPaid}
        />
        <TextSwitch isPaid={isPaid}>{isPaid ? 'Pago' : 'A pagar'}</TextSwitch>
      </GroupSwitch>

      <ButtonForm onPress={handleSave}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>
    </Container>
  )
}
