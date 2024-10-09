import { Feather, MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";

interface IconProps {
  isPaid: boolean;
}

interface PositionProps {
  align?: string;
}

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
  justify-content: flex-start;
  padding: 10px;
`;

export const ItemList = styled.ScrollView`
  margin: 10px 0px;
  width: 100%;
`;

export const Item = styled.Pressable`
  background-color: ${({ theme }) => theme.colors.shape_transparent};
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  height: 60px;
  padding: 10px;
  margin-bottom: 5px;
  border-radius: 5px;
`;

export const GroupList = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`;

export const IconList = styled(MaterialIcons)`
`;

export const TextItem = styled.Text`
  font-size: ${RFValue(16)}px;
`;

export const ContainerModal = styled.View`
  top: 90px;
  height: 70%;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 10px;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.shape};
`;

export const GroupColumn = styled.View`
`;

export const GroupItemFlatList = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 4px 0px;
`;

export const ItemDetailFlatList = styled.View`
  width: 90%;
  padding: 8px;
`;
  
export const ItemBtnFlatList = styled.View`
  width: 10%;
  height: 100%;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

export const ItemColumnList = styled.View`
  margin: 4px 0px;
`;

export const GroupItemColumn = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: yellow;
`;

export const GroupIconTextRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 4px;
  gap: 10px;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.colors.border_input};
`;

export const IconColumnListMaterial = styled(MaterialIcons)<IconProps>`
  color: ${({ theme, isPaid }) => isPaid ? theme.colors.success : theme.colors.attention};
`;

export const IconColumnList = styled(Feather)`
  color: ${({ theme }) => theme.colors.text};
`;

export const TextColumnList = styled.Text<PositionProps>`
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.text};
  text-align: ${({ align }) => align ? align : 'left'};
`;

export const BtnItem = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  border-width: 0px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.secondary};
  padding: 2px;
  width: 50px;
`;

export const TextBtnItem = styled.Text`
  color: ${({ theme }) => theme.colors.secondary};
`;
