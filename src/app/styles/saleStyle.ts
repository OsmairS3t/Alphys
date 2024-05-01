import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";

interface PaidProps {
  isPaid ?: boolean;
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

export const TitleModal = styled.Text`
  color: ${({ theme }) => theme.colors.text_title};
  font-size: ${RFValue(14)}px;
  margin: 10px 0px;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.text_title};
  font-size: ${RFValue(14)}px;
  width: 100%;
  text-align: center;
  margin: 10px 0px;
  `;

export const GroupSwitch = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 0px 10px;
  margin-bottom: 10px;
  gap: 5px;
`;

export const TitleSwitch = styled.Text`
  color: ${({ theme }) => theme.colors.text_title };
  font-size: ${RFValue(14)}px;
  font-weight: bold;
`;

export const TextSwitch = styled.Text<PaidProps>`
  color: ${({ theme, isPaid }) => 
    isPaid ? theme.colors.text_title : theme.colors.attention
  };
  font-size: ${RFValue(14)}px;
  font-weight: bold;
`;

export const GroupInput = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const GroupAmount = styled.View`
  width: 120px
`;

export const ItemAmount = styled.Text`
  color: ${({ theme }) => theme.colors.text_title };
  font-size: ${RFValue(14)}px;
`;

