import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";

export const Container = styled.View`
  top: 90px;
  background-color: ${({ theme }) => theme.colors.bg_form};
  padding: 10px;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.shape};
`;

export const TitleModal = styled.Text`
  color: ${({ theme }) => theme.colors.text_title};
  font-size: ${RFValue(14)}px;
  margin: 10px 0px;
`;

export const HeaderStock = styled.View`
  width: 100%;
  padding: 10px 0px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
`;

export const ButtonFilterStock = styled.Pressable`
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
`;

export const IconFilterStock = styled(Feather)`
  width: 28px;
  height: 28px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const ButtonNewStock = styled.Pressable`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const IconButtonNewStock = styled(Feather)`
  color: ${({ theme }) => theme.colors.background};
`;

export const TextButtonNewStock = styled.Text`
  font-size: ${RFValue(24)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.title};
  font-size: ${RFValue(14)}px;
  margin: 10px 0px;
`;

