import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';
import uuid from 'react-native-uuid';

import HeaderModal from '../components/HeaderModal';
import { InputForm } from '../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list'

import { IProduct, ISelectProps, IStock } from '../../utils/interface';
import { keyProduct, keyStock } from '../../utils/keyStorage';

import { ButtonForm, TextButton } from '../styles/global';
import { Container, TitleModal } from '../styles/stockStyle';

type StockProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  idStock: string;
}

export default function RegisterStock({ closeModal, updateList, idStock }: StockProps) {
  const theme = useTheme();
  let title_page = idStock === '' ? 'NOVO CADASTRO' : 'EDITAR CADASTRO'
  const [selected, setSelected] = useState('');
  const [amount, setAmount] = useState('');
  const [initialValue, setInitialValue] = useState<ISelectProps>({ key: '', value: '' })
  const [data, setData] = useState<ISelectProps[]>([]);

  async function loadProduct(idProduct: string) {
    const response = await AsyncStorage.getItem(keyProduct)
    const dataProduct: IProduct[] = response ? JSON.parse(response) : []
    return dataProduct.find(d => d.id === idProduct)
  }

  async function handleSave() {
    const objProduct = await loadProduct(selected)
    const dataNewStock = {
      id: uuid.v4().toString(),
      product: objProduct,
      amount: Number(amount),
      hasStock: (Number(amount) > 0) ? true : false
    }

    try {
      const response = await AsyncStorage.getItem(keyStock)
      let oldData: IStock[] = response ? JSON.parse(response) : []

      // localiza o produto na coleção existente para não duplicar
      const updateData = oldData.find(od => od.product?.id === selected)
      if (!updateData) {
        // se não tem inclui como novo
        oldData.push(dataNewStock)
        await AsyncStorage.setItem(keyStock, JSON.stringify(oldData))
        Alert.alert('Produto incluído no estoque com sucesso!')
      } else {
        // caso encontre, remove da coleção e inclui o novo com nova quantidade
        const removeData = oldData.filter(od => od.product?.id !== selected)
        removeData.push(dataNewStock)
        await AsyncStorage.setItem(keyStock, JSON.stringify(removeData))
        Alert.alert('Quantidade do produto no estoque alterada com sucesso!')
      }
      updateList();
      closeModal(false);
      // await AsyncStorage.removeItem(keyStock)
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  async function LoadProductSelect() {
    try {
      const response = await AsyncStorage.getItem(keyProduct)
      const dataProduct: IProduct[] = response ? JSON.parse(response) : []
      let newArray: ISelectProps[] = dataProduct.map(dp => {
        return { key: String(dp.id), value: dp.category?.name + ' - ' + dp.name }
      })
      setData(newArray)
    } catch (error) {
      console.log(error)
    }
  }

  async function LoadProductSelected() {
    try {
      const response = await AsyncStorage.getItem(keyStock)
      const dataStock: IStock[] = response ? JSON.parse(response) : []
      const objStock = dataStock.find(ds => ds.id === idStock)
      let newArray: ISelectProps[] = [
        {
          key: String(objStock?.product?.id),
          value: objStock?.product?.category?.name + ' - ' + objStock?.product?.name
        }]
      setData(newArray)
      setAmount(String(objStock?.amount))
      setInitialValue(newArray[0])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (idStock === '') {
      LoadProductSelect()
    } else {
      LoadProductSelected()
    }
  }, [])

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='ESTOQUE DE PRODUTOS' />

      <TitleModal>{title_page}</TitleModal>
      <SelectList
        placeholder='Informe o Produto'
        boxStyles={{ backgroundColor: theme.colors.bg_input, marginBottom: 10 }}
        dropdownStyles={{ backgroundColor: theme.colors.bg_input }}
        setSelected={(selected: string) => setSelected(selected)}
        defaultOption={initialValue}
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
