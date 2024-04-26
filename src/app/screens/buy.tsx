import React, { useState } from 'react';
import HeaderModal from '../components/HeaderModal';
import uuid from 'react-native-uuid';
import { InputForm } from '../components/Forms/InputForm';

import { Container, Title } from '../styles/buyStyle';
import { ButtonForm, TextButton, InputMask } from '../styles/global';

type BuyProps = {
  closeModal: (value: boolean) => void;
}

export default function Buy({ closeModal }: BuyProps) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')

  function handleSave() {
    const data = {
      id: uuid.v4(),
      name: name,
      amount: amount,
      price: price
    }
    console.log(data)
  }

  return (
    <Container>
       <HeaderModal closeModal={()=>closeModal(false)} titleModal='CADASTRO DE COMPRAS' />

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
