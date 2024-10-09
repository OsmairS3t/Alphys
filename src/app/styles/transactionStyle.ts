import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";

interface SizeProps {
  height?: number;
  bold?: number;
}

export const Container = styled.View<SizeProps>`
  justify-content: flex-start;
  height: ${({ height }) => height ? height : 350}px;
  background-color: ${({ theme }) => theme.colors.terceary};
  gap: 4px;
`;

export const ContainerGraphic = styled.View`
  padding: 0px 10px;

`;

export const BlockBuy = styled.View<SizeProps>`
  justify-content: flex-start;
  height: 27%;
`;

export const BlockSale = styled.View<SizeProps>`
  justify-content: flex-start;
  height: 27%;
`;

export const BlockResume = styled.View<SizeProps>`
  justify-content: flex-start;
  height: 40%;
`;

export const Title = styled.Text`
  background-color: ${({ theme }) => theme.colors.secondary_light};
  padding: 10px;
  color: ${({ theme }) => theme.colors.text_title};
  font-weight: bold;
  font-size: ${RFValue(14)}px;
  margin-bottom: 10px;
`;

export const GroupTextResume = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

export const TextResume = styled.Text<SizeProps>`
  color: ${({ theme }) => theme.colors.text_title};
  font-weight: ${({ bold }) => bold ? bold : 400};
  font-size: ${RFValue(14)}px;
  margin-bottom: 10px;
`;
