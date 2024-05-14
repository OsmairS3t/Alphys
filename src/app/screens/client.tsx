import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderModal from '../components/HeaderModal';

import { IClient, ISale } from '../../utils/interface';
import { keyClient, keySale } from '../../utils/keyStorage';
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
  const [idClient, setIdClient] = useState('')
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
    setIdClient('')
    setIsNewModalOpen(true)
  }

  function handleEditCategoryModalOpen(id: string) {
    setIdClient(id)
    setIsNewModalOpen(true)
  }

  async function deleteClient(id: string) {
    try {
      const responseSale = await AsyncStorage.getItem(keySale)
      const sales: ISale[] = responseSale ? JSON.parse(responseSale) : []
      const saleClient = sales.find(sale => sale.client?.id === id)
      if (saleClient) {
        Alert.alert('Cliente possui venda em seu nome.')
      } else {
        const responseClient = await AsyncStorage.getItem(keyClient)
        const clients: IClient[] = responseClient ? JSON.parse(responseClient) : []
        const removedItem = clients.filter(cli => cli.id !== id)
        await AsyncStorage.setItem(keyClient, JSON.stringify(removedItem))
        loadClients()
        Alert.alert('Cliente excluído com sucesso!')
      }
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  function handleDeleteClient(id: string) {
    Alert.alert(
      'Exclusao de Clientes',
      'Tem certeza que deseja excluir este Cliente?',
      [
        {
          text: 'Sim',
          onPress: () => {
            deleteClient(id)
          },
          style: 'default',
        },
        {
          text: 'Não',
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
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
              <GroupIconTextRow>
                <Pressable onPress={() => handleEditCategoryModalOpen(item.id)}>
                  <ItemColumnList>
                      <TextColumnList> {item.name}</TextColumnList>
                  </ItemColumnList>
                </Pressable>

                <Pressable onPress={() => handleDeleteClient(item.id)}>
                  <ItemColumnList>
                    <IconColumnList name='trash-2' size={24} />
                  </ItemColumnList>
                </Pressable>
              </GroupIconTextRow>
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
        <RegisterClient 
          updateList={loadClients}
          closeModal={setIsNewModalOpen} 
          idClient={idClient}
        />
      </Modal>

    </ContainerModal>
  )
}
