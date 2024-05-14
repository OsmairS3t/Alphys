import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native'
import HeaderModal from '../components/HeaderModal';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyBuy } from '../../utils/keyStorage';
import { IBuy } from '../../utils/interface';
import { InputForm } from '../components/Forms/InputForm';
import { actualDate } from '../../utils/functions';

import { Container, Title } from '../styles/buyStyle';
import { ButtonForm, TextButton, InputMask } from '../styles/global';

type BuyProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  idBuy: string;
}

export default function RegisterBuy({ closeModal, updateList, idBuy }: BuyProps) {
  let title_page = idBuy === '' ? 'NOVO CADASTRO' : 'EDITAR CADASTRO'
  const [buy, setBuy] = useState<IBuy[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [dateBuy, setDateBuy] = useState(actualDate())

  async function loadBuy(id: string) {
    try {
      const response = await AsyncStorage.getItem(keyBuy)
      const buys: IBuy[] = response ? JSON.parse(response) : []
      const foundBuy = buys.find(buy => buy.id === id)
      setName(String(foundBuy?.name))
      setAmount(String(foundBuy?.amount))
      setPrice(String(foundBuy?.price))
    } catch (e) {
      console.log(e)
    }
  }

  async function handleSave() {
    const dataBuy = {
      id: uuid.v4().toString(),
      name: name,
      amount: amount,
      price: Number(price),
      datebuy: dateBuy
    }
    try {
      const response = await AsyncStorage.getItem(keyBuy)
      let oldData: IBuy[] = response ? JSON.parse(response) : []
      const foundedData = oldData.find(od => od.id === idBuy)
      if (!foundedData) {
        oldData.push(dataBuy)
        await AsyncStorage.setItem(keyBuy, JSON.stringify(oldData))
        Alert.alert('Compra incluída com sucesso!')
      } else {
        const updateData = oldData.filter(od => od.id !== idBuy)
        updateData.push(dataBuy)
        await AsyncStorage.setItem(keyBuy, JSON.stringify(updateData))
        Alert.alert('Compra atualizada com sucesso!')
      }
      updateList();
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    if (idBuy !== '') {
      loadBuy(idBuy)
    }
  }, [])

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE COMPRAS' />

      <Title>{title_page}</Title>

      <InputForm
        placeholder='Identificação'
        onChangeText={text => setName(text)}
        value={name}
      />

      <InputForm
        placeholder='Quantidade'
        keyboardType='default'
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
        onChangeText={(price, rawText) => {
          setPrice(price)
        }}
      />

      <InputForm
        placeholder='dd/mm/yyyy'
        keyboardType='numbers-and-punctuation'
        onChangeText={text => setDateBuy(text)}
        value={dateBuy}
      />

      <ButtonForm onPress={handleSave}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>

    </Container>
  )
}
