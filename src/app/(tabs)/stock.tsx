import { useState } from 'react';
import { Modal, FlatList } from 'react-native';
import StockProducts from '../screens/stockproducts';
import FilterStock from '../screens/filterstock';
import { stocks } from '../../utils/database'

import { Container } from '../styles/global'
import { HeaderStock, 
  ButtonFilterStock, 
  IconFilterStock,
  ButtonNewStock, 
  TextButtonNewStock, 
  Title, 
  GroupStock, 
  ItemStock, 
  TextStock, 
  Separator } from '../styles/stockStyle'

export default function Stock() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)
  
  function handleFilterModalOpen() {
    setIsFilterModalOpen(true)
  }

  function handleStockModalOpen() {
    setIsStockModalOpen(true)
  }

  return (
    <Container>
      <Title>Estoque de produtos e mercadorias:</Title>
      <HeaderStock>
        <ButtonFilterStock onPress={handleFilterModalOpen}>
          <IconFilterStock name='sliders' size={24} />
        </ButtonFilterStock>
        <ButtonNewStock onPress={handleStockModalOpen}>
          <TextButtonNewStock>+</TextButtonNewStock>
        </ButtonNewStock>
      </HeaderStock>

      <GroupStock>
        {stocks.length > 0 ?
          <FlatList 
            data={stocks}
            keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
              <ItemStock>
                <TextStock>Produto: {item.product}</TextStock>
                <TextStock>Quant: {item.amount}</TextStock>
                <TextStock>Status: {item.hasStock? '':'Produto indisponível'}</TextStock>
                <Separator />
              </ItemStock>
            }  
          />
        :
          <TextStock>Não há compras ou vendas no momento</TextStock>
        }
      </GroupStock>

      <Modal 
        transparent={true}
        animationType='slide' 
        visible={isFilterModalOpen} 
        onRequestClose={() => {
          setIsFilterModalOpen(!isFilterModalOpen)
        }}>
        <FilterStock closeModal={setIsFilterModalOpen} />
      </Modal>

      <Modal 
        transparent={true}
        animationType='slide' 
        visible={isStockModalOpen} 
        onRequestClose={() => {
          setIsStockModalOpen(!isStockModalOpen)
        }}>
        <StockProducts closeModal={setIsStockModalOpen} />
      </Modal>
    </Container>
  )
}