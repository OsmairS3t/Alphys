import { useState } from 'react';
import { Modal, FlatList } from 'react-native';
import StockProducts from '../screens/stockproducts';
import { stocks } from '../../utils/database'

import { Container } from '../styles/global'
import { HeaderStock, ButtonFilterStock, ButtonNewStock, TextButtonNewStock, Title, GroupStock, ItemStock, TextStock, Separator } from '../styles/stockStyle'

export default function Stock() {
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)

  function handleModalOpen() {
    setIsStockModalOpen(true)
  }

  return (
    <Container>
      <Title>Estoque de produtos e mercadorias:</Title>
      <HeaderStock>
        <ButtonFilterStock 
          onPress={()=> {}}
          name='sliders' 
          size={24} 
        />
        <ButtonNewStock onPress={handleModalOpen}>
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
        animationType='slide' 
        presentationStyle='pageSheet'
        visible={isStockModalOpen} 
        onRequestClose={() => {
          setIsStockModalOpen(!isStockModalOpen)
        }}>
        <StockProducts closeModal={setIsStockModalOpen} />
      </Modal>
    </Container>
  )
}