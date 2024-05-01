import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.colors.title};
  font-size: ${RFValue(14)}px;
  margin-bottom: 10px;
`;

export const Content = styled.View`
  padding: 0px 10px;
`;

export const HightLightCards = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingHorizontal: 16 }
})`
  position: relative;
  width: 100%;
  height: 100px;
  margin: 16px 0px;
`;