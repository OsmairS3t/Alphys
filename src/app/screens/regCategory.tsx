import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useTheme } from 'styled-components';
import uuid from 'react-native-uuid';

import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';

import HeaderModal from '../components/HeaderModal';
import { InputForm } from '../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list'

import { featherIcons, IFeatherIcons } from '../../utils/database';
import { ICategory, ISelectProps } from '../../utils/interface';
import { keyCategory } from '../../utils/keyStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Container, Title } from '../styles/categoryStyle';
import { ButtonForm, TextButton } from '../styles/global';

type CategoryProps = {
  closeModal: (value: boolean) => void;
}

const schema = z
  .object({
    name: z.string().min(3, 'O nome da categoria deve ter pelo menos 3 caracteres.'),
  })

type TypeData = z.infer<typeof schema>

export default function RegisterCategory({ closeModal }: CategoryProps) {
  const theme = useTheme()
  const [selectedIcon, setSelectedIcon] = useState("")
  const [data, setData] = useState<ISelectProps[]>(IFeatherIcons);
  const { handleSubmit, control, formState: { errors } } = useForm<TypeData>({
    resolver: zodResolver(schema)
  })

  async function handleSave(formData: TypeData) {
    const dataCategory = {
      id: uuid.v4().toString(),
      name: formData.name,
      icon: selectedIcon
    }
    try {
      const response = await AsyncStorage.getItem(keyCategory)
      let oldData: ICategory[] = response ? JSON.parse(response) : []

      oldData.push(dataCategory)

      await AsyncStorage.setItem(keyCategory, JSON.stringify(oldData))
      Alert.alert('Categoria incluída com sucesso!')
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE CATEGORIAS' />

      <Title>NOVO CADASTRO:</Title>
      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputForm
            placeholder='Nome da categoria'
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="name"
      />

      <SelectList
        placeholder='Icone da categoria'
        boxStyles={{ backgroundColor: theme.colors.bg_input, marginBottom: 10 }}
        dropdownStyles={{ backgroundColor: theme.colors.bg_input }}
        setSelected={(val: string) => setSelectedIcon(val)}
        data={data}
        save="key"
      />

      <ButtonForm onPress={handleSubmit(handleSave)}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>
    </Container>
  )
}
