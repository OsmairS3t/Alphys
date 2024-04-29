import React, { useState } from 'react';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { InputForm } from '../components/Forms/InputForm';

import HeaderModal from '../components/HeaderModal';

import { Container, 
  Title, 
  GroupImage, 
  GroupButton, 
  TexttypeBalance, 
  BtnImage, 
  IconImage, 
  IconCamera, 
  PhotoImage, 
  ImgCapture } from '../styles/clientStyle';
import { ButtonForm, TextButton } from '../styles/global';
import { IClient } from '../../utils/interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyClient } from '../../utils/keyStorage';
import { Alert } from 'react-native';

type ClientProps = {
  closeModal: (value: boolean) => void;
}

export default function Client({ closeModal }: ClientProps) {
  const [name, setName] = useState('')
  const [imgPhoto, setImgPhoto] = useState('../../assets/foto_cliente.png')
  
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

  async function handleSave() {
    const data = {
      id: uuid.v4().toString(),
      name: name,
      photo: imgPhoto,
    }
    try {
      const response = await AsyncStorage.getItem(keyClient)
      let oldData: IClient[] = response ? JSON.parse(response) : []

      oldData.push(data)

      await AsyncStorage.setItem(keyClient, JSON.stringify(oldData))
      Alert.alert('Cliente incluído com sucesso!')
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='CADASTRO DE CLIENTES' />

      <Title>NOVO CADASTRO:</Title>
      <InputForm 
        placeholder='Nome'
        onChangeText={text => setName(text)}
        value={name}
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
  )
}
