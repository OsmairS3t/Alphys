import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  flex: 1;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.title};
  font-size: ${RFValue(18)}px;
  padding: 10px 10px 0px 10px;
  `;

export const ListGroup = styled.View`
  justify-content: space-around;
  padding: 10px;;
`;

export const ItemList = styled.View`
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
`;

export const Item = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.shape};
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.border_input};
  border-radius: 5px;
  `;

export const TextItem = styled.Text`
  font-size: ${RFValue(16)}px;
`;

