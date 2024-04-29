import React, { useState, useEffect } from 'react';
import { Alert, Text, View } from 'react-native'
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
      return b
    } catch (e) {
      console.log(e)
    }
  }

  async function handleSave() {
    const data = {
      id: uuid.v4().toString(),
      name: name,
      amount: Number(amount),
      price: Number(price)
    }
    try {
      const response = await AsyncStorage.getItem(keyBuy)
      let oldData: IBuy[] = response ? JSON.parse(response) : []

      oldData.push(data)

      await AsyncStorage.setItem(keyBuy, JSON.stringify(oldData))
      Alert.alert('Compra incluída com sucesso!')
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

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
      <ButtonForm onPress={handleSave}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>

    </Container>
  )
}
