import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';

import HeaderModal from '../components/HeaderModal';

import { ISale } from '../../utils/interface';
import { keySale } from '../../utils/keyStorage';
import RegisterSale from './regSale';

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

type SaleProps = {
  closeModal: (value: boolean) => void;
}

export default function Sale({ closeModal }: SaleProps) {
  const theme = useTheme();
  const [idSale, setIdSale] = useState('')
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [sales, setSales] = useState<ISale[]>([]);

  async function loadSales() {
    try {
      const response = await AsyncStorage.getItem(keySale)
      const sale: ISale[] = response ? JSON.parse(response) : []
      setSales(sale)
    } catch (e) {
      console.log(e)
    }
  }

  function handleNewSaleModalOpen() {
    setIdSale('')
    setIsNewModalOpen(true)
  }

  function handleEditSaleModalOpen(id: string) {
    setIdSale(id)
    setIsNewModalOpen(true)
  }

  async function deleteSale(id: string) {
    try {
      const responseSale = await AsyncStorage.getItem(keySale)
      const sales: ISale[] = responseSale ? JSON.parse(responseSale) : []
      const removedItem = sales.filter(sale => sale.id !== id)
      await AsyncStorage.setItem(keySale, JSON.stringify(removedItem))
      loadSales()
      Alert.alert('Venda excluída com sucesso!')
    } catch (error) {
      console.log('Erro ao tentar excluir: ', error)
    }
  }

  function handleDeleteSale(id: string) {
    Alert.alert(
      'Exclusao de Venda',
      'Tem certeza que deseja excluir esta venda?',
      [
        {
          text: 'Sim',
          onPress: () => {
            deleteSale(id)
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
    loadSales()
  }, [])

  return (
    <ContainerModal>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE VENDAS' />

      <HeaderScreenPage>
        <ButtonNewScreenPage onPress={handleNewSaleModalOpen}>
          <IconButtonNewScreenPage name='plus' size={24} />
        </ButtonNewScreenPage>
      </HeaderScreenPage>

      <GroupColumn>
        {sales.length > 0 ?
          <FlatList
            style={{ height: 450 }}
            data={sales}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <GroupIconTextRow>
                <Pressable onPress={() => handleEditSaleModalOpen(item.id)}>
                  <ItemColumnList>
                    <TextColumnList>Cliente: {item.client?.name}</TextColumnList>
                    <TextColumnList>Produto: {item.product?.name}</TextColumnList>
                    <TextColumnList>Quant.: {item.amount}</TextColumnList>
                    <TextColumnList>
                      Valor: {Intl
                        .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
                        .format(item.price)}
                    </TextColumnList>
                    <TextColumnList>Situação: {item.isPaid ? 'Pago' : 'A pagar'}</TextColumnList>
                  </ItemColumnList>
                </Pressable>

                <Pressable onPress={() => handleDeleteSale(item.id)}>
                  <IconColumnList name='trash-2' size={24} />
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
        <RegisterSale
          closeModal={setIsNewModalOpen}
          updateList={loadSales}
          idSale={idSale}
        />
      </Modal>

    </ContainerModal>
  )
}
