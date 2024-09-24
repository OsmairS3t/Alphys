import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useCategoryDatabase } from '../../../hooks/useCategoryDatabase';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InputForm } from '../../components/Forms/InputForm';
import { ICategory } from '../../../utils/interface';
import { Container, Title } from '../../styles/categoryStyle';
import { ButtonForm, TextButton, TextError } from '../../styles/global';
import HeaderModal from '../../components/HeaderModal';

type CategoryProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  idCategory: number;
}

const schema = z.object({
  name: z.string({ message: 'Informe o nome da categoria.' })
    .min(2, 'O nome da Categoria deve ter no mínimo 2 caracteres.')
})

export default function RegisterCategory({ closeModal, updateList, idCategory }: CategoryProps) {
  const params = useLocalSearchParams<{ id: string }>()
  const categoryDatabase = useCategoryDatabase()
  const [category, setCategory] = useState<ICategory>()
  const { handleSubmit, control, setValue, formState: { errors } } = useForm<ICategory>({ resolver: zodResolver(schema) })
  let title_page = "Editar Categoria"

  async function handleUpdate() {

  }

  useEffect(() => {
    if (params.id) {
      categoryDatabase.searchById(Number(params.id)).then(response => {
        if (response) {
          setCategory({
            id: response.id,
            name: response.name
          })
          console.log(response)
        }
      })
    }
  }, [params.id])

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
            value={category?.name}
          />
        )}
      />
      {errors.name && <TextError>{errors.name.message}</TextError>}

      <ButtonForm onPress={handleSubmit(handleUpdate)}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>
    </Container>
  )
}