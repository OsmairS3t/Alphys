import React, { useEffect, useState } from 'react';
import { useTheme } from 'styled-components';
import { featherIcons } from '../../utils/database';
import uuid from 'react-native-uuid';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';

import HeaderModal from '../components/HeaderModal';
import { InputForm } from '../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list'

import { Container, Title } from '../styles/categoryStyle';
import { ButtonForm, TextButton } from '../styles/global';
import { ICategory, ISelectProps } from '../../utils/interface';

type CategoryProps = {
  closeModal: (value: boolean) => void;
}

const schema = z
  .object({
    name: z.string().min(3,'O nome da categoria deve ter pelo menos 3 caracteres.'),
  })

type TypeData = z.infer<typeof schema>

export default function Category({ closeModal }: CategoryProps) {
  const theme = useTheme()
  const [selectedIcon, setSelectedIcon] = useState("")
  const [data, setData] = useState<ISelectProps[]>([]);
  const { handleSubmit, control, formState: {errors} } = useForm<TypeData>({
    resolver: zodResolver(schema)
  })

  function handleSave(formData: TypeData) {
    const data = {
      id: uuid.v4(),
      name: formData.name,
      icon: selectedIcon
    }
    console.log(data)
  }

  useEffect(()=>{
    let newArray:ISelectProps[] = featherIcons.map(fi => {
      return {key: fi.name, value: fi.name}
    })
    setData(newArray)
  },[])

  return (
    <Container>
      <HeaderModal closeModal={()=>closeModal(false)} titleModal='CADASTRO DE CATEGORIAS' />

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
        boxStyles={{backgroundColor: theme.colors.bg_input, marginBottom: 10}}
        dropdownStyles={{backgroundColor: theme.colors.bg_input}}
        setSelected={(val:string) => setSelectedIcon(val)} 
        data={data} 
        save="key"
      />

      <ButtonForm onPress={handleSubmit(handleSave)}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>
    </Container>
  )
}
