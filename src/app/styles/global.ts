import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { MaskedTextInput } from 'react-native-mask-text'
import styled from "styled-components/native";
import { Link } from "expo-router";

interface Props{
  color: string;
}

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 10px;
`;

export const ContainerNetInfo = styled.View`
  position: absolute;
  top: 30px;
  width: 100%;
`;

export const NetInfo = styled.View<Props>`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ color }) => color ? color : "#c9fcd4" };
  height: 50px;
  width: 100%;
  padding: 10px;
`;

export const IconNetInfo = styled(Feather).attrs({ size: 24 })`
  color: ${({ theme }) => theme.colors.primary};
`;

export const TextNetInfo = styled.Text`
  font-size: 16px;
  text-align: center;
`;

export const ContainerSignIn = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.secondary};
  justify-content: center;
  align-items: center;
  gap: 100px;
`;

export const HeaderLogin = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 60px;
`;

export const ImgLogoLogin = styled.Image`
  width: 150px;
  height: 65px;
`;

export const ImgCredit = styled.Image`
  width: 20px;
  height: 20px;
`;

export const LabelForm = styled.Text`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text_title};  
`;

export const GroupLink = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  gap: 10px;
`;

export const LinkScreen = styled(Link)``;

export const TextLink = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.shape};
`;

export const Form = styled.View`
  width: 100%;
`;

export const ButtonSignIn = styled.Pressable`
  border-radius: 10px;
  width: 100%;
  height: 60px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.secondary_light};
`;

export const TextButtonSignIn = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const ButtonForm = styled.TouchableOpacity`
  border-radius: 4px;
  width: 100%;
  height: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const InputMask = styled(MaskedTextInput).attrs(({theme}) => ({
  placeholderTextColor: theme.colors.text_placeholder,
}))`
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
  height: 50px;
  border: 1px;
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.text};
  border-color: ${({ theme }) => theme.colors.border_input};
  background-color: ${({ theme }) => theme.colors.bg_input};
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
  justify-content: space-between;
  align-items: center;
  padding: 30px 20px 4px 20px;
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const ContainerImgHeader = styled.View`
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

export const IconUser = styled(Feather).attrs({ size: 24 })`
  color: ${({ theme }) => theme.colors.shape};
`;

export const IconSignOut = styled(Feather).attrs({ size: 24 })`
  color: ${({ theme }) => theme.colors.shape};
`;

export const Error = styled.Text`
  font-size: ${RFValue(12)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.attention};
  margin-top: -4px;
  margin-bottom: 6px;
`;

export const HeaderScreenPage = styled.View`
  width: 100%;
  padding: 10px 0px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
`;

export const ButtonFilterScreenPage = styled.Pressable`
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
`;

export const IconFilterScreenPage = styled(Feather)`
`;

export const ButtonNewScreenPage = styled.Pressable`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.secondary};
`;

export const IconButtonNewScreenPage = styled(Feather)`
  color: ${({ theme }) => theme.colors.background};
`;

export const TextButtonNewScreenPage = styled.Text`
  font-size: ${RFValue(24)}px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.background};
`;

export const IconList = styled(Feather)`
  color: ${({ theme }) => theme.colors.text};
`;

export const TextError = styled.Text`
  color: ${({ theme }) => theme.colors.attention};
  font-size: ${RFValue(12)}px;
  padding-bottom: 10px;
`;
