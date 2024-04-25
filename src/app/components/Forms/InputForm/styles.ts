import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize'; 

export const Container = styled.View``;

export const Input = styled.TextInput.attrs(({theme}) => ({
  placeholderTextColor: theme.colors.text_placeholder,
}))`
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 50px;
  border: 1px;
  border-radius: 8px;
  border-color: ${({ theme }) => theme.colors.border_input};
  background-color: ${({ theme }) => theme.colors.bg_input};
  color: ${({ theme }) => theme.colors.text};
`;

export const Error = styled.Text`
  font-size: ${RFValue(12)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.attention};
  margin-top: -4px;
  margin-bottom: 6px;
`;
