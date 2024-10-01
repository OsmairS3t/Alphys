import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native'
import HeaderModal from '../../components/HeaderModal';
import { InputForm } from '../../components/Forms/InputForm';
import { actualDate } from '../../../utils/functions';

import { Container, Title } from '../../styles/buyStyle';
import { ButtonForm, TextButton, InputMask } from '../../styles/global';
import { ITransaction } from '../../../utils/interface';
import { useTransactionDatabase } from '../../../hooks/useTransactionDatabase';

type BuyProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  buy: ITransaction | undefined;
}

export default function RegisterBuy({ closeModal, updateList, buy }: BuyProps) {
  let title_page = buy ? 'EDITAR CADASTRO' : 'NOVO CADASTRO'
  const transactionDatabase = useTransactionDatabase()
  const [modality, setModality] = useState('buy')
  const [kind, setKind] = useState('')
  const [place, setPlace] = useState('')
  const [productName, setProductName] = useState('')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [dateBuy, setDateBuy] = useState(actualDate())
  const [ispaid, setIsPaid] = useState(false)

  async function loadBuy() {
    try {
      if(buy) {
        setKind(String(buy.kind))
        setPlace(String(buy.place))
        setProductName(buy.product_name)
        setAmount(String(buy.amount))
        setPrice(String(buy.price))
        setIsPaid(buy.ispaid)
      }
    } catch (e) {
      console.log(e)
    }
  }
  
  async function handleSave() {
    try {
      let foundedData = null
      if(Number(buy?.id)) {
        foundedData = await transactionDatabase.searchById(Number(buy?.id))
      }
      if(foundedData) {
        await transactionDatabase.update({
          id: Number(buy?.id),
          modality: modality,
          kind: kind,
          place: place,
          product_name: productName,
          client_name: String(buy?.client_name),
          amount: Number(amount),
          price: Number(price),
          datetransaction: dateBuy,
          ispaid: ispaid,
          stock_id: 0
        })
        Alert.alert('Compra atualizada com sucesso!')
      } else {
        await transactionDatabase.create({
          modality: modality,
          kind: kind,
          place: place,
          product_name: productName,
          client_name: String(buy?.client_name),
          amount: Number(amount),
          price: Number(price),
          datetransaction: dateBuy,
          ispaid: ispaid,
          stock_id: 0
        })
        Alert.alert('Compra incluída com sucesso!')
      }
      updateList();
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    if (buy) {
      loadBuy()
    }
  }, [])

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE COMPRAS' />

      <Title>{title_page}</Title>

      <InputForm
        placeholder='Tipo de produto'
        onChangeText={text => setKind(text)}
        value={kind}
      />

      <InputForm
        placeholder='Produto'
        onChangeText={text => setProductName(text)}
        value={productName}
      />

      <InputForm
        placeholder='Local da compra'
        onChangeText={text => setPlace(text)}
        value={place}
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
