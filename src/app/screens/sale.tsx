import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, Modal } from 'react-native';
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
  ItemColumnList,
  GroupIconTextRow,
  IconColumnList,
  TextColumnList
} from '../styles/registerStyle';

type SaleProps = {
  closeModal: (value: boolean) => void;
}

export default function Sale({ closeModal }: SaleProps) {
  const theme = useTheme();
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
    setIsNewModalOpen(true)
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
              <Pressable onPress={() => { }}>
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
        <RegisterSale closeModal={setIsNewModalOpen} />
      </Modal>

    </ContainerModal>
  )
}
