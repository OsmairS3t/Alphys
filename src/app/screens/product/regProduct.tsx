import React, { useEffect, useState } from 'react';
import { Alert, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from 'styled-components';
import HeaderModal from '../../components/HeaderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyCategory, keyProduct } from '../../../utils/keyStorage';
import { MaskedText, mask } from "react-native-mask-text";

// import { categories } from '../../utils/database';
import { ICategory, IProduct, ISelectProps } from '../../../utils/interface';

import uuid from 'react-native-uuid';

import { InputForm } from '../../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list';

import { ButtonForm, TextButton, InputMask, Error } from '../../styles/global';
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
} from '../../styles/productStyle';
import { useCategoryDatabase } from '../../../hooks/useCategoryDatabase';
import { useProductDatabase } from '../../../hooks/useProductDatabase';

type ProductProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  product: IProduct | undefined;
}

export default function RegisterProduct({ closeModal, updateList, product }: ProductProps) {
  let title_page = product ? 'EDITAR CADASTRO' : 'NOVO CADASTRO'
  const theme = useTheme()
  const categoryDatabase = useCategoryDatabase()
  const productDatabase = useProductDatabase()
  const [search, setSearch] = useState('')
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
    const response = await categoryDatabase.searchByName(search)
    setCategories(response)
    let newArray: ISelectProps[] = response.map(cat => {
      return { key: String(cat.id), value: cat.name }
    })
    setData(newArray)
  }

  async function loadCategory(nameCategory: string) {
    const response = await categoryDatabase.findByName(nameCategory)
    return response
  }

  async function loadProduct(id: number) {
    const response = await productDatabase.searchById(id)
    if (response) {
      const cat: ICategory = await loadCategory(response.categoryname)
      setCategorySelect({ key: String(cat.id), value: cat.name })
      setNameProduct(String(response.name))
      const priceFormatted = mask(String(response.price), "0.00")
      setPriceValue(String(response.price))
      // const code = mask("ABC1234", "AAA-9999")
      // console.log('preco: ', priceFormatted)
    }
  }

  async function handleSave() {
    if (selected === '') {
      Alert.alert('Informe a categoria.')
    }
    try {
      await productDatabase.create({
        categoryname: selected,
        name: nameProduct,
        price: Number(priceValue),
        photo: imgPhoto,
      })
      updateList()
      Alert.alert('Produto incluído com sucesso!')
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    loadCategories()
    if (product) {
      loadProduct(product.id)
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
            save="value"
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
