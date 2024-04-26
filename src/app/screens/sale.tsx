import React, { useEffect, useState } from 'react';
import { Switch } from 'react-native';
import { useTheme } from 'styled-components';
import HeaderModal from '../components/HeaderModal';

import { ISelectProps } from '../../utils/interface';
import { clients, products } from '../../utils/database';
import uuid from 'react-native-uuid';
import { InputForm } from '../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list';

import { Container, Title, GroupSwitch, TitleSwitch, TextSwitch } from '../styles/saleStyle';
import { ButtonForm, TextButton, InputMask } from '../styles/global';

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
    const client = clients.find(cli => cli.id === idClient)
    return client
  }
  
  function loadProducts(idProduct: string) {
    const product = products.find(pro => pro.id === idProduct)
    return product
  }

  function handleSave() {
    const data = {
      id: uuid.v4(),
      client: loadClients(selectedClient),
      product: loadProducts(selectedProduct),
      amount: amount,
      price: price,
      isPaid: isPaid
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
