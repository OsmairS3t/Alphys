import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 10px;
`;

export const HeaderStock = styled.View`
  width: 100%;
  padding: 10px 0px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
`;

export const ButtonFilterStock = styled(Feather)`
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
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

export const TextButtonNewStock = styled.Text`
  font-size: ${RFValue(24)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.title};
  font-size: ${RFValue(18)}px;
  `;

export const GroupStock = styled.View`
  padding-top: 10px;
`;

export const ItemStock = styled.View``;

export const TextStock = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(14)}px;
`;

export const Separator = styled.View`
  width: 100%;
  margin: 4px 0px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.colors.primary};
`;