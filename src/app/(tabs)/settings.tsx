import React from 'react';
import { View, Text } from 'react-native';

import { useForm, Controller } from 'react-hook-form';
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';

import { Button } from '../components/Forms/Button';
import { InputForm } from '../components/Forms/InputForm';
// import { Container } from './styles';

type Props = {
  name: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('O nome é necessário'),
})

const Settings: React.FC = () => {
  const { handleSubmit, control, formState: {errors}} = useForm<Props>({
    resolver: yupResolver(schema)
  })

  function handleSave(form: Props) {
    console.log(form)
  }

  return (
    <View>
      <Text>Settings</Text>
      <Controller 
        name='name'
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <InputForm 
            id='name' 
            onChangeText={onChange}
            onBlur={onBlur}
            keyboardType='default'
            value={value}
          />
        )}
      />
      <Button title='Salvar' onPress={handleSubmit(handleSave)} />
    </View>
  )
}

export default Settings;