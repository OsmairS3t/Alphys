import { useState, useEffect, useCallback } from 'react';
import { Modal, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import StockProducts from '../screens/stockproducts';
import FilterStock from '../screens/filterstock';

import { keySale, keyStock } from '../../utils/keyStorage';
import { ISale, IStock } from '../../utils/interface';

import { Container } from '../styles/global'
import { Title,
TitleModal,
GroupSale,
ItemSale,
LineSale,
TextSale,
QtdSale,
StatusSale,
IconSale,
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
              <ItemSale>
                <Pressable onPress={() => {}}>
                  <LineSale>
                    <TextSale>
                      {item.client?.name} - {item.product?.category?.name} - {item.product?.name}
                    </TextSale>
                    <QtdSale>
                      {Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(item.price)}
                    </QtdSale>
                    <StatusSale>
                      {item.isPaid ?
                        <IconSale name='attach-money' size={20} accessibilityHint='Pago' /> :
                        <IconSale name='money-off' size={20} accessibilityHint='A pagar' />
                      }
                    </StatusSale>
                  </LineSale>
                </Pressable>
                <Separator />
              </ItemSale>
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