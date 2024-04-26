import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from 'styled-components';
import HeaderModal from '../components/HeaderModal';

import { categories } from '../../utils/database';
import { ISelectProps } from '../../utils/interface';

import uuid from 'react-native-uuid';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { InputForm } from '../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list';

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
  ImgCapture } from '../styles/productStyle';
import { ButtonForm, TextButton, InputMask } from '../styles/global';

type ProductProps = {
  closeModal: (value: boolean) => void;
}

const schema = z
  .object({
    name: z.string().min(2,'O nome do produto deve ter pelo menos 2 caracteres.'),
  })

type TypeData = z.infer<typeof schema>

export default function Product({ closeModal }: ProductProps) {
  const theme = useTheme()
  const [imgPhoto, setImgPhoto] = useState<string>('../../assets/produto_padrao.png')
  const [priceValue, setPriceValue] = useState('0')
  const [selected, setSelected] = useState("")
  const [data, setData] = useState<ISelectProps[]>([]);
  const { handleSubmit, control, reset, formState: {errors} } = useForm<TypeData>({
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

  function loadCategory(idCategory: string) {
    const category = categories.find(cat => cat.id === idCategory)
    return category
  }

  function handleSave(formData: TypeData) {
    const data = {
      id: uuid.v4(),
      category: loadCategory(selected),
      name: formData.name,
      price: priceValue,
      photo: imgPhoto,
    }
    console.log(data)
  }

  useEffect(()=>{
    let newArray:ISelectProps[] = categories.map(cat => {
      return {key: cat.id, value: cat.name}
    })
    setData(newArray)
  },[])

  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='CADASTRO DE PRODUTOS' />

      <Title>NOVO CADASTRO</Title>
      <SelectList 
        placeholder='Categoria'
        boxStyles={{backgroundColor: theme.colors.bg_input, marginBottom: 10}}
        dropdownStyles={{backgroundColor: theme.colors.bg_input}}
        setSelected={(val:string) => setSelected(val)} 
        data={data} 
        save="key"
      />

      <Controller 
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputForm 
            placeholder='Nome do produto'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="name"
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
  )
}
