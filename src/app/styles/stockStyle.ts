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

export const TitleModal = styled.Text`
  color: ${({ theme }) => theme.colors.text_title};
  font-size: ${RFValue(14)}px;
  margin: 10px 0px;
`;

export const GroupStock = styled.View`
  padding-top: 10px;
`;

export const ItemStock = styled.View``;

export const LineStock = styled.View`
  width: 100%;
  flex-direction: row;
  padding: 2px 0px;
  align-items: center;
`;

export const TextStock = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(14)}px;
  `;

export const QtdStock = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(14)}px;
  width: 100px;
  `;

export const StatusStock = styled.View`
  justify-content: center;
  align-items: center;
  width: 50px;
`;

export const IconStock = styled(Feather)`
  color: ${({ theme }) => theme.colors.text};
`;

export const Separator = styled.View`
  width: 100%;
  margin: 4px 0px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.colors.primary};
`;