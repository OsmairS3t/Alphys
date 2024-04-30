import { MaterialIcons } from "@expo/vector-icons";
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

export const GroupSale = styled.View`
  padding-top: 10px;
`;

export const ItemSale = styled.View``;

export const LineSale = styled.View`
  width: 100%;
  flex-direction: row;
  padding: 2px 0px;
  align-items: center;
`;

export const TextSale = styled.Text`
  flex: 1;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(14)}px;
  `;

export const QtdSale = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(14)}px;
  width: 60px;
  `;

export const StatusSale = styled.View`
  justify-content: center;
  align-items: center;
  width: 30px;
`;

export const IconSale = styled(MaterialIcons)`
  color: ${({ theme }) => theme.colors.text};
`;

export const Separator = styled.View`
  width: 100%;
  margin: 4px 0px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.colors.primary};
`;