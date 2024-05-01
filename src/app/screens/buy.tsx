import React, { useState, useEffect } from 'react';
import { Modal, Pressable, FlatList } from 'react-native'
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
  ItemColumnList,
  TextColumnList
} from '../styles/registerStyle';

export default function Buy({ closeModal }: BuyProps) {
  const [buys, setBuys] = useState<IBuy[]>([])
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  async function loadBuys() {
    try {
      const response = await AsyncStorage.getItem(keyBuy)
      const buy: IBuy[] = response ? JSON.parse(response) : []
      setBuys(buy)
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewBuyModalOpen() {
    setIsNewModalOpen(true)
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
          <FlatList
            style={{ height: 450 }}
            data={buys}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <Pressable onPress={() => { }}>
                <ItemColumnList>
                  <TextColumnList>Descrição: {item.name}</TextColumnList>
                  <TextColumnList>Quant.: {item.amount}</TextColumnList>
                  <TextColumnList>
                    Valor: {Intl
                      .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                      .format(item.price)}
                  </TextColumnList>
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
        <RegisterBuy closeModal={setIsNewModalOpen} />
      </Modal>

    </ContainerModal>
  )
}
