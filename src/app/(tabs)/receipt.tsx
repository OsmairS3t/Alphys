import { useState, useEffect, useCallback } from 'react';
import { Modal, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StockProducts from '../screens/regStock';
import FilterStock from '../screens/filterstock';

import { keySale, keyStock } from '../../utils/keyStorage';
import { ISale, IStock } from '../../utils/interface';

import { Container } from '../styles/global'
import {
  Title,
  GroupSale,
  ItemSale,
  ClientReceipt,
  ProductReceipt,
  PriceReceipt,
  TextSale,
  QtdSale,
  StatusSale,
  IconSale,
  BtnSituation,
  TextBtnSituation,
  Separator
} from '../styles/receiptStyle'

export default function Stock() {
  const [sales, setSales] = useState<ISale[]>([])
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  async function loadSales() {
    try {
      const response = await AsyncStorage.getItem(keySale)
      const arraySales: ISale[] = response ? JSON.parse(response) : []
      setSales(arraySales)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    loadSales()
  }, [])

  return (
    <Container>
      <Title>Recebimentos de Vendas:</Title>

      <GroupSale>
        {sales.length > 0 ?
          <FlatList
            data={sales}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <Pressable onPress={() => { }}>
                <ItemSale>
                  <ClientReceipt>
                    Cliente: {item.client?.name}
                  </ClientReceipt>
                  <ProductReceipt>
                    Produto: {item.product?.category?.name} - {item.product?.name}
                  </ProductReceipt>
                  <QtdSale>
                    Quant.:{item.amount}
                  </QtdSale>
                  <PriceReceipt>
                    Valor: {Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(item.price)}
                  </PriceReceipt>
                  <QtdSale>
                    Data: {item.dateSale}
                  </QtdSale>
                  <BtnSituation isPaid={item.isPaid}>
                    {item.isPaid ?
                      <StatusSale>
                        <IconSale name='attach-money' size={20} />
                        <TextBtnSituation>Pago</TextBtnSituation>
                      </StatusSale>
                      :
                      <StatusSale>
                        <IconSale name='money-off' size={20} />
                        <TextBtnSituation>A pagar</TextBtnSituation>
                      </StatusSale>
                    }
                  </BtnSituation>
                  <Separator />
                </ItemSale>
              </Pressable>
            }
          />
          :
          <TextSale>Não há vendas no momento</TextSale>
        }
      </GroupSale>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isDetailModalOpen}
        onRequestClose={() => {
          setIsDetailModalOpen(!isDetailModalOpen)
        }}>
        <FilterStock closeModal={setIsDetailModalOpen} />
      </Modal>

    </Container>
  )
}