import React, { useEffect, useState } from 'react';
import { Alert, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from 'styled-components';
import HeaderModal from '../components/HeaderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyCategory, keyProduct } from '../../utils/keyStorage';
import { MaskedText, mask } from "react-native-mask-text";

// import { categories } from '../../utils/database';
import { ICategory, IProduct, ISelectProps } from '../../utils/interface';

import uuid from 'react-native-uuid';

import { InputForm } from '../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list';

import { ButtonForm, TextButton, InputMask, Error } from '../styles/global';
import {
  Container,
  Title,
  GroupImage,
  GroupButton,
  TexttypeBalance,
  BtnImage,
  IconImage,
  IconCamera,
  PhotoImage,
  ImgCapture
} from '../styles/productStyle';

type ProductProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  idProduct: string;
}

export default function RegisterProduct({ closeModal, updateList, idProduct }: ProductProps) {
  const theme = useTheme()
  let title_page = idProduct === '' ? 'NOVO CADASTRO' : 'EDITAR CADASTRO'
  const [errCateogry, setErrCategory] = useState('')
  const [errName, setErrName] = useState('')
  const [errPrice, setErrPrice] = useState('')
  const [categories, setCategories] = useState<ICategory[]>([])
  const [imgPhoto, setImgPhoto] = useState<string>('../../assets/produto_padrao.png')
  const [nameProduct, setNameProduct] = useState("")
  const [priceValue, setPriceValue] = useState("")
  const [selected, setSelected] = useState("")
  const [data, setData] = useState<ISelectProps[]>([]);
  const [categorySelect, setCategorySelect] = useState({ key: '', value: '' })

  const PickImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1
    })
    // console.log(result)
    if (!result.canceled) {
      setImgPhoto(result.assets[0].uri)
    }
  }

  const PickImageCamera = async () => {
    //LoadImage();
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync()
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    console.log(result)
    if (!result.canceled) {
      setImgPhoto(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  }

  async function loadCategories() {
    const response = await AsyncStorage.getItem(keyCategory)
    const categories: ICategory[] = response ? JSON.parse(response) : []
    setCategories(categories)
    let newArray: ISelectProps[] = categories.map(cat => {
      return { key: cat.id, value: cat.name }
    })
    setData(newArray)
  }

  async function loadCategory(idCategory: string) {
    const response = await AsyncStorage.getItem(keyCategory)
    const categories: ICategory[] = response ? JSON.parse(response) : []
    const category = categories.find(cat => cat.id === idCategory)
    return category
  }

  async function loadProduct(id: string) {
    const response = await AsyncStorage.getItem(keyProduct)
    const products: IProduct[] = response ? JSON.parse(response) : []
    const objProduct = products.find(pro => pro.id === id)
    setCategorySelect({ key: String(objProduct?.category?.id), value: String(objProduct?.category?.name) })
    setNameProduct(String(objProduct?.name))
    const code = mask("ABC1234", "AAA-9999") // return ABC-1234
    const priceFormatted = mask(String(objProduct?.price), "0.00")
    setPriceValue(String(objProduct?.price))
    console.log('preco: ', priceFormatted)
  }

  async function handleSave() {
    if (selected === '') {
      Alert.alert('Informe a categoria.')
    }
    const dataCategory = {
      id: uuid.v4().toString(),
      category: await loadCategory(selected),
      name: nameProduct,
      price: Number(priceValue),
      photo: imgPhoto,
    }
    try {
      const response = await AsyncStorage.getItem(keyProduct)
      let oldData: IProduct[] = response ? JSON.parse(response) : []

      oldData.push(dataCategory)

      await AsyncStorage.setItem(keyProduct, JSON.stringify(oldData))
      updateList()
      Alert.alert('Produto incluído com sucesso!')
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    loadCategories()
    if (idProduct !== '') {
      loadProduct(idProduct)
    }
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView behavior='position' enabled>
        <Container>
          <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE PRODUTOS' />

          <Title>{title_page}</Title>
          <SelectList
            placeholder='Categoria'
            boxStyles={{ backgroundColor: theme.colors.bg_input, marginBottom: 10 }}
            dropdownStyles={{ backgroundColor: theme.colors.bg_input }}
            setSelected={(val: string) => setSelected(val)}
            data={data}
            save="key"
            defaultOption={categorySelect}
          />
          {errCateogry !== '' && <Error>{errCateogry}</Error>}

          <InputForm
            placeholder='Nome do produto'
            onChangeText={text => setNameProduct(text)}
            value={nameProduct}
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
            onChangeText={(priceValue, rawText) => {
              setPriceValue(priceValue)
            }}
          />

          <GroupImage>
            <GroupButton>
              <TexttypeBalance>Foto:</TexttypeBalance>
              <BtnImage onPress={PickImageLibrary}>
                <IconImage name='image' />
              </BtnImage>
              <BtnImage onPress={PickImageCamera}>
                <IconCamera name='camera' />
              </BtnImage>
            </GroupButton>
            <PhotoImage>
              <ImgCapture source={{ uri: imgPhoto }} />
            </PhotoImage>
          </GroupImage>

          <ButtonForm onPress={handleSave}>
            <TextButton>Salvar</TextButton>
          </ButtonForm>

        </Container>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
