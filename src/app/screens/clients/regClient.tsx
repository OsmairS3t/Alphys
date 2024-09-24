import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import uuid from 'react-native-uuid';
import * as ImagePicker from 'expo-image-picker';
import { InputForm } from '../../components/Forms/InputForm';
import { IClient } from '../../../utils/interface';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keyClient } from '../../../utils/keyStorage';

import HeaderModal from '../../components/HeaderModal';

import { ButtonForm, TextButton } from '../../styles/global';
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
} from '../../styles/clientStyle';
import { useClientDatabase } from '../../../hooks/useClientDatabase';


type ClientProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  client: IClient | undefined;
}

export default function RegisterClient({ closeModal, updateList, client }: ClientProps) {
  const clientDatabase = useClientDatabase()
  let title_page = client ? 'EDITAR CADASTRO' : 'NOVO CADASTRO'
  const [id, setId] = useState(0)
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

  async function loadClient(id: number) {
    const response = await clientDatabase.searchById(id)
    if (response) {
      setId(response.id)
      setName(String(response.name))
      setImgPhoto(String(response.photo))
    }
  }

  async function handleSave() {
    try {
      if(id > 0) {
        await clientDatabase.update({ id: id, name: name, photo: imgPhoto })
        Alert.alert('Cliente alterado com sucesso!')
      } else {
        await clientDatabase.create({ name: name, photo: imgPhoto })
        Alert.alert('Cliente incluído com sucesso!')
      }
      updateList()
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    if(client) {
      loadClient(client.id)
    }
  }, [])

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE CLIENTES' />

      <Title>{title_page}</Title>
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
