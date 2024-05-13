import { RFValue } from "react-native-responsive-fontsize";
import { styled } from "styled-components/native";
import { Image as Img } from 'react-native'
import { Feather } from "@expo/vector-icons";

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
  color: ${({ theme }) => theme.colors.text_title};
  font-size: ${RFValue(14)}px;
  width: 100%;
  text-align: center;
  margin: 10px 0px;
  `;

export const GroupImage = styled.View`
    width: 100%;
    height: 90px;
    padding: 10px;
    margin-bottom: 10px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 50px;
`;

export const GroupButton = styled.View`
    width: 100px;
    flex-direction: row;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 4px;
    `;

export const PhotoImage = styled.View`
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-right: 10px;
`;

export const ImgCapture = styled(Img)`
    width: 70px;
    height: 70px;
`;

export const BtnImage = styled.Pressable`
    width: 36px;
    height: 36px;
    padding: 5px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    background-color: ${({theme }) => theme.colors.secondary_light};
`;

export const IconCamera = styled(Feather).attrs(({theme})=>({
    size: 24,
    color: '#000000'
}))``;

export const IconImage = styled(Feather).attrs(({theme})=>({
    size: 24,
    color: '#000000'
}))``;

export const TexttypeBalance = styled.Text`
  color: ${({theme }) => theme.colors.text};
`;
