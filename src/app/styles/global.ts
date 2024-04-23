import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.shape};
  justify-content: center;
  align-items: center;
`;

export const LabelForm = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};  
`;

export const ButtonSignIn = styled.Pressable`
  border-radius: 10px;
  width: 90%;
  height: 60px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const ButtonForm = styled.Pressable`
  border-radius: 4px;
  width: 100%;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const ButtonCloseModal = styled.Pressable`
  border-radius: 4px;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.shape};
`;

export const TextButton = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.title};
`;

export const TextButtonModal = styled.Text`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const HeaderContainerModaL = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0px 8px;
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const TitleModal = styled.Text`
  color: ${({ theme }) => theme.colors.title};
  font-size: ${RFValue(14)}px;
`;

export const TitleForm = styled.Text`
  font-size: ${RFValue(14)}px;
  color: ${({ theme }) => theme.colors.title};
  width: 100%;
  text-align: center;
  margin: 10px 0px;
`;

export const ContainerHeader = styled.View`
  height: 100px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 30px 20px 4px 20px;
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const ContainerImgHeader = styled.View`
  width: 100%;
  height: ${RFValue(100)}px;
  background-color: ${({ theme }) => theme.colors.secondary};
  align-items: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ImgLogoHeader = styled.Image`
  width: 150px;
  height: 65px;
`;

export const IconSignOut = styled(Feather).attrs({ size: 24 })`
  color: ${({ theme }) => theme.colors.shape};
`;