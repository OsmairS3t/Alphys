import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import HeaderModal from '../../components/HeaderModal';
import { InputForm } from '../../components/Forms/InputForm';
import { ICategory } from '../../../utils/interface';
import { Container, Title } from '../../styles/categoryStyle';
import { ButtonForm, TextButton, TextError } from '../../styles/global';
import { useCategoryDatabase } from '../../../hooks/useCategoryDatabase';

type CategoryProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  idCategory: number;
}

const schema = z.object({
  name: z.string({ message: 'Informe o nome da categoria.' })
    .min(2, 'O nome da Categoria deve ter no mínimo 2 caracteres.')
})

export default function Register_Category({ closeModal, updateList, idCategory }: CategoryProps) {
  const [category, setCategory] = useState<ICategory>()
  const categoryDatabase = useCategoryDatabase()
  const { handleSubmit, control, setValue, formState: { errors } } = useForm<ICategory>({ resolver: zodResolver(schema) })
  let title_page = idCategory === 0 ? 'NOVO CADASTRO' : 'EDITAR CADASTRO'

  async function loadCategory(id: number) {
    const response = await categoryDatabase.searchById(id)
    if (response) {
      setCategory(response)
    }
  }

  async function create(formData: ICategory) {
    try {
      const response = await categoryDatabase.create({
        name: formData.name
      })
      Alert.alert('Categoria cadastrada com sucesso.')
      updateList()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (idCategory > 0) {
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
            value={category?.name}
          />
        )}
      />
      {errors.name && <TextError>{errors.name.message}</TextError>}

      <ButtonForm onPress={handleSubmit(create)}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>
    </Container>
  )
}
