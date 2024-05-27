import React, { useState, useEffect } from 'react';
import { Alert, Modal, Pressable, FlatList } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';

import { keyBuy } from '../../utils/keyStorage';
import { IBuy } from '../../utils/interface';

import HeaderModal from '../components/HeaderModal';
import RegisterBuy from './regBuy';

type BuyProps = {
  closeModal: (value: boolean) => void;
}

import {
  HeaderScreenPage,
  ButtonNewScreenPage,
  IconButtonNewScreenPage
} from '../styles/global';
import {
  ContainerModal,
  GroupColumn,
  GroupIconTextRow,
  ItemColumnList,
  TextColumnList,
  IconColumnList
} from '../styles/registerStyle';

export default function Buy({ closeModal }: BuyProps) {
  const [sumValues, setSumValues] = useState(0)
  const [idBuy, setIdBuy] = useState('')
  const [buys, setBuys] = useState<IBuy[]>([])
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  async function loadBuys() {
    try {
      const response = await AsyncStorage.getItem(keyBuy)
      const buy: IBuy[] = response ? JSON.parse(response) : []
      let tot = 0
      buy.map(b => {
        tot += b.price
      })
      setSumValues(tot)
      setBuys(buy)
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewBuyModalOpen() {
    setIdBuy('')
    setIsNewModalOpen(true)
  }

  function handleEditBuyModalOpen(id: string) {
    setIdBuy(id)
    setIsNewModalOpen(true)
  }

  async function deleteBuy(id: string) {
    try {
      const responseBuy = await AsyncStorage.getItem(keyBuy)
      const buys: IBuy[] = responseBuy ? JSON.parse(responseBuy) : []
      const removedItem = buys.filter(buy => buy.id !== id)
      await AsyncStorage.setItem(keyBuy, JSON.stringify(removedItem))
      loadBuys()
      Alert.alert('Compra excluída com sucesso!')
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  function handleDeleteBuy(id: string) {
    Alert.alert(
      'Exclusao de Compra',
      'Tem certeza que deseja excluir esta compra?',
      [
        {
          text: 'Sim',
          onPress: () => {
            deleteBuy(id)
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

  useEffect(() => {
    loadBuys()
  }, [])

  return (
    <ContainerModal>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE COMPRAS' />

      <HeaderScreenPage>
        <ButtonNewScreenPage onPress={handleNewBuyModalOpen}>
          <IconButtonNewScreenPage name='plus' size={24} />
        </ButtonNewScreenPage>
      </HeaderScreenPage>

      <GroupColumn>
        {buys.length > 0 ?
          <>
            <FlatList
              style={{ height: 430 }}
              data={buys}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                <GroupIconTextRow>
                  <Pressable onPress={() => { handleEditBuyModalOpen(item.id) }}>
                    <ItemColumnList>
                      <TextColumnList>Descrição: {item.name}</TextColumnList>
                      <TextColumnList>Quant.: {item.amount}</TextColumnList>
                      <TextColumnList>
                        Valor: {Intl
                          .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                          .format(item.price)}
                      </TextColumnList>
                      <TextColumnList>
                        Dia da compra: {item.datebuy}
                      </TextColumnList>
                    </ItemColumnList>
                  </Pressable>

                  <Pressable onPress={() => handleDeleteBuy(item.id)}>
                    <ItemColumnList>
                      <IconColumnList name='trash-2' size={24} />
                    </ItemColumnList>
                  </Pressable>
                </GroupIconTextRow>
              }
            />
            <ItemColumnList>
              <TextColumnList align='right'>
                Total: {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sumValues)}
              </TextColumnList>
            </ItemColumnList>
          </>
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
        <RegisterBuy
          closeModal={setIsNewModalOpen}
          updateList={loadBuys}
          idBuy={idBuy}
        />
      </Modal>

    </ContainerModal>
  )
}
