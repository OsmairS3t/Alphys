import React, { useEffect, useState } from 'react';
import { Alert, Switch, Text, View } from 'react-native';
import { useTheme } from 'styled-components';
import HeaderModal from '../components/HeaderModal';

import { IClient, IProduct, ISale, ISelectProps, IStock } from '../../utils/interface';
// import { clients, products } from '../../utils/database';

import uuid from 'react-native-uuid';
import { InputForm } from '../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list';

import { keyClient, keyProduct, keySale, keyStock } from '../../utils/keyStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { actualDate } from '../../utils/functions';

import { Container, Title, GroupSwitch, TitleSwitch, TextSwitch, GroupInput, GroupAmount, ItemAmount } from '../styles/saleStyle';
import { ButtonForm, TextButton, InputMask } from '../styles/global';

type SaleProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  idSale: string;
}

export default function RegisterSale({ closeModal, updateList, idSale }: SaleProps) {
  const theme = useTheme();
  let title_page = idSale === '' ? 'NOVO CADASTRO' : 'EDITAR CADASTRO'
  const [dataClient, setDataClient] = useState<ISelectProps[]>([{ key: '', value: '' }]);
  const [dataProduct, setDataProduct] = useState<ISelectProps[]>([{ key: '', value: '' }]);
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [amountStock, setAmountStock] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [isPaid, setIsPaid] = useState(false);

  async function loadClient(idClient: string) {
    const response = await AsyncStorage.getItem(keyClient)
    const clients: IClient[] = response ? JSON.parse(response) : []
    const objClient = clients.find(cli => cli.id === idClient)
    return objClient
  }

  async function loadProduct(idProduct: string) {
    const response = await AsyncStorage.getItem(keyProduct)
    const products: IProduct[] = response ? JSON.parse(response) : []
    const objProduct = products.find(pro => pro.id === idProduct)
    return objProduct
  }

  async function loadStockProduct(idProduct: string) {
    const response = await AsyncStorage.getItem(keyStock)
    const dataStock: IStock[] = response ? JSON.parse(response) : null
    const stockProduct = dataStock.find(ds => ds.product?.id === idProduct)
    setAmountStock(String(stockProduct?.amount))
  }

  async function loadClients() {
    const response = await AsyncStorage.getItem(keyClient)
    const clients: IClient[] = response ? JSON.parse(response) : []
    let newArray: ISelectProps[] = clients.map(cli => {
      return { key: String(cli.id), value: String(cli.name) }
    })
    setDataClient(newArray)
  }

  async function loadStock() {
    const response = await AsyncStorage.getItem(keyStock)
    const dataStock: IStock[] = response ? JSON.parse(response) : []
    let newArray: ISelectProps[] = dataStock.map(ds => {
      return { key: String(ds.product?.id), value: String(ds.product?.category?.name + ' - ' + ds.product?.name) }
    })
    setDataProduct(newArray)
  }

  async function handleSave() {
    const result = await AsyncStorage.getItem(keyStock)
    const dataStock: IStock[] = result ? JSON.parse(result) : []
    const stockFound = dataStock.find(de => de.product?.id === selectedProduct)
    let stockUpdate = dataStock.filter(de => de.product?.id !== selectedProduct)
    if (Number(amount) > Number(stockFound?.amount)) {
      Alert.alert('Não há quantidade disponível para este produto.')
      return false;
    } else {
      const newAmount = Number(stockFound?.amount) - Number(amount)
      let idStock = ''
      let objProduct: IProduct | undefined
      if (stockFound) {
        idStock = String(stockFound.id)
        objProduct = stockFound.product
      }
      const dataNewStock = {
        id: idStock,
        product: objProduct,
        amount: newAmount,
        hasStock: newAmount > 0 ? true : false
      }
      stockUpdate.push(dataNewStock)
    }
    const data = {
      id: uuid.v4().toString(),
      client: await loadClient(selectedClient),
      product: await loadProduct(selectedProduct),
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
      await AsyncStorage.setItem(keySale, JSON.stringify(oldData))
      //console.log('Venda :', oldData)
      Alert.alert('Venda incluída com sucesso!')
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    loadClients()
    loadStock()
  }, [])

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE VENDAS' />

      <Title>{title_page}</Title>
      <SelectList
        placeholder='Cliente'
        boxStyles={{ backgroundColor: theme.colors.bg_input, marginBottom: 10 }}
        dropdownStyles={{ backgroundColor: theme.colors.bg_input }}
        setSelected={(val: string) => setSelectedClient(val)}
        data={dataClient}
        save="key"
      />

      <SelectList
        placeholder='Produto'
        boxStyles={{ backgroundColor: theme.colors.bg_input, marginBottom: 10 }}
        dropdownStyles={{ backgroundColor: theme.colors.bg_input }}
        setSelected={(val: string) => setSelectedProduct(val)}
        data={dataProduct}
        save="key"
        onSelect={() => loadStockProduct(selectedProduct)}
      />

      <GroupInput>
        <InputForm
          placeholder='Quantidade'
          keyboardType='numeric'
          onChangeText={text => setAmount(text)}
          value={amount}
          style={{ width: 200 }}
        />
        <GroupAmount>
          <ItemAmount>Estoque: {amountStock}</ItemAmount>
        </GroupAmount>
      </GroupInput>

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
          style={{ width: 50 }}
          trackColor={{ false: '#c4c4c4', true: '#c4c4c4' }}
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
