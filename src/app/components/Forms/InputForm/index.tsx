import React from 'react';
import { TextInputProps } from 'react-native';

import { Container, Input, Error } from './styles';

// type Props = TextInputProps;
interface Props extends TextInputProps {
  error ?: string;
}

export function InputForm({error, ...rest}: Props) {
  return (
    <Container>
      <Input {...rest} />
      <Error>{error}</Error>
    </Container>
  )
}