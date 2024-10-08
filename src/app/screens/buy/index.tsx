import React, { useState, useEffect } from 'react';
import { Alert, Modal, Pressable, FlatList } from 'react-native'
import { ITransaction } from '../../../utils/interface';
import HeaderModal from '../../components/HeaderModal';
import RegisterBuy from './regBuy';

type BuyProps = {
  closeModal: (value: boolean) => void;
}

import {
  HeaderScreenPage,
  ButtonNewScreenPage,
  IconButtonNewScreenPage
} from '../../styles/global';
import {
  ContainerModal,
  GroupColumn,
  GroupIconTextRow,
  ItemColumnList,
  TextColumnList,
  IconColumnList,
  GroupItemFlatList,
  ItemDetailFlatList,
  ItemBtnFlatList
} from '../../styles/registerStyle';
import { useTransactionDatabase } from '../../../hooks/useTransactionDatabase';

export default function Buy({ closeModal }: BuyProps) {
  const transactionDatabase = useTransactionDatabase()
  const [sumValues, setSumValues] = useState(0)
  const [buy, setBuy] = useState<ITransaction>()
  const [buys, setBuys] = useState<ITransaction[]>([])
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)

  async function loadBuys() {
    try {
      const response = await transactionDatabase.searchByModality('buy')
      let tot = 0
      if(response) {
        response.map(b => {
          tot += b.price
        })
        setSumValues(tot)
        setBuys(response)
      }
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewBuyModalOpen() {
    setBuy(undefined)
    setIsNewModalOpen(true)
  }

  function handleEditBuyModalOpen(item: ITransaction) {
    setBuy(item)
    setIsNewModalOpen(true)
  }

  async function deleteBuy(id: number) {
    try {
      await transactionDatabase.remove(id)
      loadBuys()
      Alert.alert('Compra excluída com sucesso!')
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  function handleDeleteBuy(id: number) {
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
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) =>
                <GroupItemFlatList>
                  <ItemDetailFlatList>
                    <TextColumnList>Descrição: {item.product_name}</TextColumnList>
                    <TextColumnList>Quant.: {item.amount}</TextColumnList>
                    <TextColumnList>
                      Valor: {Intl
                        .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                        .format(item.price)}
                    </TextColumnList>
                    <TextColumnList>
                      Dia da compra: {item.datetransaction}
                    </TextColumnList>
                  </ItemDetailFlatList>

                  <ItemBtnFlatList>
                    <Pressable onPress={() => { handleEditBuyModalOpen(item) }}>
                        <IconColumnList name='edit' size={24} />
                    </Pressable>
                    <Pressable onPress={() => handleDeleteBuy(item.id)}>
                        <IconColumnList name='trash-2' size={24} />
                    </Pressable>
                  </ItemBtnFlatList>

                </GroupItemFlatList>
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
          buy={buy}
        />
      </Modal>

    </ContainerModal>
  )
}
