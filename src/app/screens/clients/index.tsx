import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { IClient } from '../../../utils/interface';
import HeaderModal from '../../components/HeaderModal';
import RegisterClient from './regClient';

import {
  HeaderScreenPage,
  ButtonNewScreenPage,
  IconButtonNewScreenPage
} from '../../styles/global';

import {
  ContainerModal,
  GroupColumn,
  ItemColumnList,
  GroupIconTextRow,
  IconColumnList,
  TextColumnList
} from '../../styles/registerStyle';
import { useClientDatabase } from '../../../hooks/useClientDatabase';
import { useTransactionDatabase } from '../../../hooks/useTransactionDatabase';

type ClientProps = {
  closeModal: (value: boolean) => void;
}

export default function Client({ closeModal }: ClientProps) {
  const clientDatabase = useClientDatabase()
  const transactionDatabase = useTransactionDatabase()
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [photo, setPhoto] = useState('')
  const [client, setClient] = useState<IClient>()
  const [clients, setClients] = useState<IClient[]>([])
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  async function loadClients() {
    try {
      const response = await clientDatabase.find()
      if(response) {
        setClients(response)
      }
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewCategoryModalOpen() {
    setClient(undefined)
    setIsNewModalOpen(true)
  }

  function handleEditCategoryModalOpen(cli: IClient) {
    setClient(cli)
    setIsNewModalOpen(true)
  }

  async function deleteClient(id: number) {
    try {
      const responseCli = await clientDatabase.searchById(id)
      if(responseCli) {
        const responseSale = await transactionDatabase.searchByClient(responseCli.name)
        if (responseSale) {
          Alert.alert('Cliente possui venda em seu nome e não pode ser removido.')
        }
      } else {
        await clientDatabase.remove(id)
        Alert.alert('Cliente excluído com sucesso!')
      }
      loadClients()
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  function handleDeleteClient(id: number) {
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
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) =>
              <GroupIconTextRow>
                <Pressable onPress={() => handleEditCategoryModalOpen(item)}>
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
          <TextColumnList>Não há clientes cadastrados</TextColumnList>
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
          client={client}
        />
      </Modal>

    </ContainerModal>
  )
}
