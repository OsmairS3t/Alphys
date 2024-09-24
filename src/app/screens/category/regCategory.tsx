import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HeaderModal from '../../components/HeaderModal';
import { InputForm } from '../../components/Forms/InputForm';
import { ICategory } from '../../../utils/interface';
import { Container, Title } from '../../styles/categoryStyle';
import { ButtonForm, TextButton } from '../../styles/global';
import { useCategoryDatabase } from '../../../hooks/useCategoryDatabase';

type CategoryProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  category: ICategory | undefined;
}

export default function RegisterCategory({ closeModal, updateList, category }: CategoryProps) {
  let title_page = category ? 'EDITAR CADASTRO' : 'NOVO CADASTRO'
  const categoryDatabase = useCategoryDatabase()
  const [id, setId] = useState(0)
  const [name, setName] = useState('')

  function loadCategory() {
    if(category) {
      setId(category.id)
      setName(category.name)
    }
  }

  async function Save() {
    Alert.alert('clicou', category?.name)
    try {
      category ?  
        await categoryDatabase.update({ id, name })
      : 
        await categoryDatabase.create({ name: name })
      Alert.alert('Categoria cadastrada com sucesso.')
      updateList()
      closeModal(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadCategory()
  },[])

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE CATEGORIAS' />

      <Title>{title_page}</Title>
      <InputForm
        placeholder='Nome da Categoria'
        onChangeText={setName}
        value={name}
      />

      <ButtonForm onPress={Save}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>
    </Container>
  )
}
