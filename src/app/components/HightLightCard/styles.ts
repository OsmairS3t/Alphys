import styled, { css } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Feather } from '@expo/vector-icons';

interface ModalityProps {
  modality: 'sell' | 'buy' | 'total';
}

export const Container = styled.View<ModalityProps>`
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme, modality }) => 
  modality === 'total' ? theme.colors.secondary : theme.colors.shape};
  width: ${RFValue(315)}px;
  border-radius: 10px;
  padding: 10px;
  margin-right: 16px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text<ModalityProps>`
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ modality, theme }) => 
  modality === 'total' ? theme.colors.shape : theme.colors.background};
`;

export const Footer = styled.View``;

export const Price = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  color: ${({ theme }) => theme.colors.background};
  font-size: ${RFValue(22)}px;
`;

export const LastTransaction = styled.Text`
  font-family: ${({ theme }) => theme.fonts.light};
  color: ${({ theme }) => theme.colors.background};
  font-size: 12px;
`;

export const Icon = styled(Feather)<ModalityProps>`
  font-size: ${RFValue(20)}px;

  ${({ modality }) => modality === 'sell' && css`
    color: ${({ theme }) => theme.colors.success};
  `}

  ${({ modality }) => modality === 'buy' && css`
    color: ${({ theme }) => theme.colors.attention};
  `}

  ${({ modality }) => modality === 'total' && css`
    color: ${({ theme }) => theme.colors.shape};
  `}
`;