import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, Modal } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderModal from '../components/HeaderModal';

import { IClient } from '../../utils/interface';
import { keyClient } from '../../utils/keyStorage';
import RegisterClient from './regClient';

import {
  HeaderScreenPage,
  ButtonNewScreenPage,
  IconButtonNewScreenPage
} from '../styles/global';

import {
  ContainerModal,
  GroupColumn,
  ItemColumnList,
  GroupIconTextRow,
  IconColumnList,
  TextColumnList
} from '../styles/registerStyle';


type ClientProps = {
  closeModal: (value: boolean) => void;
}

export default function Client({ closeModal }: ClientProps) {
  const [clients, setClients] = useState<IClient[]>([])
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  async function loadClients() {
    try {
      const response = await AsyncStorage.getItem(keyClient)
      const dataClient: IClient[] = response ? JSON.parse(response) : []
      setClients(dataClient)
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewCategoryModalOpen() {
    setIsNewModalOpen(true)
  }

  useFocusEffect(
    useCallback(() => {
      loadClients();
    }, [])
  )

  return (
    <ContainerModal>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE CLIENTES' />

      <HeaderScreenPage>
        <ButtonNewScreenPage onPress={handleNewCategoryModalOpen}>
          <IconButtonNewScreenPage name='plus' size={24} />
        </ButtonNewScreenPage>
      </HeaderScreenPage>

      <GroupColumn>
        {clients.length > 0 ?
          <FlatList
            style={{ height: 450 }}
            data={clients}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <Pressable onPress={() => { }}>
                <ItemColumnList>
                  <GroupIconTextRow>
                    <TextColumnList>Nome: {item.name}</TextColumnList>
                  </GroupIconTextRow>
                </ItemColumnList>
              </Pressable>
            }
          />
          :
          <TextColumnList>Não há produtos cadastrados no estoque</TextColumnList>
        }
      </GroupColumn>

      <Modal
        transparent={true}
        animationType='fade'
        visible={isNewModalOpen}
        onRequestClose={() => {
          setIsNewModalOpen(!isNewModalOpen)
        }}>
        <RegisterClient closeModal={setIsNewModalOpen} />
      </Modal>

    </ContainerModal>
  )
}
