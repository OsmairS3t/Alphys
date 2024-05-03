import { MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";

type BtnSituationProps = {
  isPaid: boolean;
}

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
  font-size: ${RFValue(18)}px;
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

export const ClientReceipt = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(14)}px;
`;

export const ProductReceipt = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(14)}px;
`;

export const PriceReceipt = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(14)}px;
`;

export const TextSale = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(14)}px;
`;

export const QtdSale = styled.Text`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${RFValue(14)}px;
`;

export const IconSale = styled(MaterialIcons)`
  color: ${({ theme }) => theme.colors.text};
`;

export const BtnSituation = styled.Pressable<BtnSituationProps>`
  padding: 4px 10px;
  background-color: ${({ theme, isPaid }) => isPaid ? theme.colors.success_light : theme.colors.attention_light};
`;

export const StatusSale = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

export const TextBtnSituation = styled.Text`
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