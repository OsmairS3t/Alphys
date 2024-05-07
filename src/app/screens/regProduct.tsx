import React, { useEffect, useState } from 'react';
import { Alert, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from 'styled-components';
import HeaderModal from '../components/HeaderModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyCategory, keyProduct } from '../../utils/keyStorage';

// import { categories } from '../../utils/database';
import { ICategory, IProduct, ISelectProps } from '../../utils/interface';

import uuid from 'react-native-uuid';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { InputForm } from '../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list';

import { ButtonForm, TextButton, InputMask } from '../styles/global';
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

const schema = z
  .object({
    name: z.string().min(2, 'O nome do produto deve ter pelo menos 2 caracteres.'),
    price: z.string().min(1, 'O preço tem que ter...')
  })

type TypeData = z.infer<typeof schema>

export default function RegisterProduct({ closeModal, updateList, idProduct }: ProductProps) {
  const theme = useTheme()
  let title_page = idProduct === '' ? 'NOVO CADASTRO' : 'EDITAR CADASTRO'
  const [categories, setCategories] = useState<ICategory[]>([])
  const [imgPhoto, setImgPhoto] = useState<string>('../../assets/produto_padrao.png')
  const [priceValue, setPriceValue] = useState("")
  const [selected, setSelected] = useState("")
  const [data, setData] = useState<ISelectProps[]>([]);
  const { handleSubmit, control, setValue, formState: { errors } } = useForm<TypeData>({
    resolver: zodResolver(schema)
  })
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
    const categories:ICategory[] = response ? JSON.parse(response) : []
    setCategories(categories)
    let newArray: ISelectProps[] = categories.map(cat => {
      return { key: cat.id, value: cat.name }
    })
    setData(newArray)
  }

  async function loadCategory(idCategory: string) {
    const response = await AsyncStorage.getItem(keyCategory)
    const categories:ICategory[] = response ? JSON.parse(response) : []
    const category = categories.find(cat => cat.id === idCategory)
    return category
  }

  async function loadProduct(id: string) {
    const response = await AsyncStorage.getItem(keyProduct)
    const products:IProduct[] = response ? JSON.parse(response) : []
    const objProduct = products.find(pro => pro.id === id)
    setValue('name', String(objProduct?.name))
    setPriceValue(String(objProduct?.price))
  }

  async function handleSave(formData: TypeData) {
    const dataCategory = {
      id: uuid.v4().toString(),
      category: await loadCategory(selected),
      name: formData.name,
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
    if(idProduct !== '') {
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
          />

          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputForm
                placeholder='Nome do produto'
                onChangeText={onChange}
                value={value}
              />
            )}
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
              setPriceValue(text)
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

          <ButtonForm onPress={handleSubmit(handleSave)}>
            <TextButton>Salvar</TextButton>
          </ButtonForm>

        </Container>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}
