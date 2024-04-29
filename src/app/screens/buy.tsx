import React, { useState, useEffect } from 'react';
import { Alert, Text } from 'react-native'
import HeaderModal from '../components/HeaderModal';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyBuy } from '../../utils/keyStorage';
import { IBuy } from '../../utils/interface';
import { InputForm } from '../components/Forms/InputForm';

import { Container, Title } from '../styles/buyStyle';
import { ButtonForm, TextButton, InputMask } from '../styles/global';
import { setStatusBarStyle } from 'expo-status-bar';

type BuyProps = {
  closeModal: (value: boolean) => void;
}

export default function Buy({ closeModal }: BuyProps) {
  const [buy, setBuy] = useState<IBuy[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')

  async function getAsyncStorageBuy() {
    try {
      const result = await AsyncStorage.getItem(keyBuy)
      const b: IBuy[] = result !== null ? JSON.parse(result) : []
      setBuy(b)
    } catch (e) {
      console.log(e)
    }
  }

  async function setAsyncStorageBuy(buy: IBuy) {
    try {
      const dataBuy = JSON.stringify(buy)
      await AsyncStorage.setItem(keyBuy, dataBuy)
    } catch (e) {
      console.log(e)
    }
  }

  function handleSave() {
    const data = {
      id: uuid.v4().toString(),
      name: name,
      amount: Number(amount),
      price: Number(price)
    }
    setAsyncStorageBuy(data)
    Alert.alert('Compra salva com sucesso!')
    console.log(data)
  }

  useEffect(() => {
    getAsyncStorageBuy();
  }, [])

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE COMPRAS' />

      <Title>NOVO CADASTRO:</Title>

      <InputForm
        placeholder='Identificação'
        onChangeText={text => setName(text)}
        value={name}
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

      {
        buy.map(b => (
          <Text>b.name</Text>
        ))
      }

      <ButtonForm onPress={handleSave}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>

    </Container>
  )
}
