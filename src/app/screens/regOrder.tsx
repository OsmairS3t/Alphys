import { useState, useEffect, useCallback } from 'react';
import { Modal, FlatList, Pressable, Alert } from 'react-native';
import uuid from 'react-native-uuid';
import { useTheme } from 'styled-components';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StockProducts from '../screens/regStock';
import FilterStock from '../components/Filter/filterstock';

import { keyClient, keyOrder, keyProduct, keySale, keyStock } from '../../utils/keyStorage';
import { IClient, IOrder, IProduct, ISale, ISelectProps, IStock } from '../../utils/interface';

import { ButtonForm, InputMask, TextButton } from '../styles/global'
import { Container, Title } from '../styles/orderStyle'
import { SelectList } from 'react-native-dropdown-select-list';
import { InputForm } from '../components/Forms/InputForm';
import HeaderModal from '../components/HeaderModal';

type OrderProps = {
  closeModal: (value: boolean) => void;
  updateList: (type: string, id: string) => void;
  idOrder: string;
}

export default function RegisterOrder({ closeModal, updateList, idOrder }: OrderProps) {
  let title_page = idOrder === '' ? 'NOVO CADASTRO' : 'EDITAR CADASTRO'
  const theme = useTheme()
  const [dataClient, setDataClient] = useState<ISelectProps[]>([{ key: '', value: '' }]);
  const [dataProduct, setDataProduct] = useState<ISelectProps[]>([{ key: '', value: '' }]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [obs, setObs] = useState('')

  async function loadClientOnce(idClient: string) {
    const response = await AsyncStorage.getItem(keyClient)
    const arrayClients: IClient[] = response ? JSON.parse(response) : []
    const clientFound = arrayClients.find(ac => ac.id === idClient)
    return clientFound
  }

  async function loadClients() {
    try {
      const response = await AsyncStorage.getItem(keyClient)
      const arrayClients: IClient[] = response ? JSON.parse(response) : []
      let newArray: ISelectProps[] = arrayClients.map(cli => {
        return { key: String(cli.id), value: String(cli.name) }
      })
      setDataClient(newArray)
    } catch (e) {
      console.log(e)
    }
  }

  async function loadProductOnce(idProduct: string) {
    const response = await AsyncStorage.getItem(keyProduct)
    const arrayProducts: IProduct[] = response ? JSON.parse(response) : []
    const productFound = arrayProducts.find(ap => ap.id === idProduct)
    return productFound
  }

  async function loadProducts() {
    try {
      const response = await AsyncStorage.getItem(keyProduct)
      const arrayProducts: IProduct[] = response ? JSON.parse(response) : []
      let newArray: ISelectProps[] = arrayProducts.map(pro => {
        return { key: String(pro.id), value: String(pro.category?.name) +' - '+ String(pro.name) }
      })
      setDataProduct(newArray)
    } catch (e) {
      console.log(e)
    }
  }

  async function handleSave() {
    const dataOrder = {
      id: uuid.v4().toString(),
      client: await loadClientOnce(selectedClient),
      product: await loadProductOnce(selectedProduct),
      amount: Number(amount),
      price: Number(price),
      obs: obs
    }
    try {
      const response = await AsyncStorage.getItem(keyOrder)
      let oldData: IOrder[] = response ? JSON.parse(response) : []

      oldData.push(dataOrder)

      await AsyncStorage.setItem(keyOrder, JSON.stringify(oldData))
      Alert.alert('Encomenda incluída com sucesso!')   
      closeModal(false) 
    } catch(error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    loadClients()
    loadProducts()
  }, [])

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE ENCOMENDAS' />

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

      <InputForm
          placeholder='Observação'
          keyboardType='default'
          onChangeText={text => setObs(text)}
          value={obs}
        />

      <ButtonForm onPress={handleSave}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isDetailModalOpen}
        onRequestClose={() => {
          setIsDetailModalOpen(!isDetailModalOpen)
        }}>
        <FilterStock closeModal={setIsDetailModalOpen} />
      </Modal>

    </Container>
  )
}