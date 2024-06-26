import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import HeaderModal from '../components/HeaderModal';
import { InputForm } from '../components/Forms/InputForm';

import { ICategory } from '../../utils/interface';
import { keyCategory } from '../../utils/keyStorage';

import { Container, Title } from '../styles/categoryStyle';
import { ButtonForm, TextButton, TextError } from '../styles/global';

type CategoryProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  idCategory: string;
}

const schema = z.object({
  name: z.string({ message: 'Informe o nome da categoria.' })
    .min(2, 'O nome da Categoria deve ter no mínimo 2 caracteres.')
})

export default function RegisterCategory({ closeModal, updateList, idCategory }: CategoryProps) {
  const { handleSubmit, control, setValue, formState: { errors } } = useForm<ICategory>({ resolver: zodResolver(schema) })
  let title_page = idCategory === '' ? 'NOVO CADASTRO' : 'EDITAR CADASTRO'

  async function loadCategory(id: string) {
    const response = await AsyncStorage.getItem(keyCategory)
    const categories: ICategory[] = response ? JSON.parse(response) : []
    const objCategory = categories.find(cat => cat.id === id)
    setValue('name', String(objCategory?.name))
  }

  async function handleSave(formData: ICategory) {
    const dataCategory = {
      id: uuid.v4().toString(),
      name: String(formData.name),
    }
    try {
      const response = await AsyncStorage.getItem(keyCategory)
      let oldData: ICategory[] = response ? JSON.parse(response) : []

      const foundedData = oldData.find(od => od.id === idCategory)
      if (!foundedData) {
        oldData.push(dataCategory)
        await AsyncStorage.setItem(keyCategory, JSON.stringify(oldData))
        Alert.alert('Categoria incluída com sucesso!')
      } else {
        const updateData = oldData.filter(od => od.id !== idCategory)
        updateData.push(dataCategory)
        await AsyncStorage.setItem(keyCategory, JSON.stringify(updateData))
        Alert.alert('Categoria alterada com sucesso!')
      }
      updateList();
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    if (idCategory!=='') {
      loadCategory(idCategory)
    }
  }, [])

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE CATEGORIAS' />

      <Title>{title_page}</Title>
      <Controller
        name='name'
        control={control}
        render={({ field: { onChange, value } }) => (
          <InputForm
            placeholder='Nome da Categoria'
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.name && <TextError>{errors.name.message}</TextError>}

      <ButtonForm onPress={handleSubmit(handleSave)}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>
    </Container>
  )
}
