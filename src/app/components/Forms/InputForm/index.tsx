import React from 'react';
import { TextInputProps } from 'react-native';

import { Container, Input, Error } from './styles';

type Props = TextInputProps;

export function InputForm({...rest}: Props) {
  return (
    <Container>
      <Input {...rest} />
      <Error></Error>
    </Container>
  )
}