import { useWindowDimensions, FlatList, Pressable } from 'react-native';
import { HightLightCard } from '../components/HightLightCard';
import { TransactionCard } from '../components/TransactionCard';
import { ISale, ITransactionViewProps } from '../../utils/interface'

import { Container, Title, HightLightCards, Content } from '../styles/transactionStyle'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { keySale } from '../../utils/keyStorage';

export default function Transactions() {
  const { height } = useWindowDimensions();
  const newHeight = height - 260
  const transactionView: ITransactionViewProps[] = [
    {
      id: '1',
      description: 'Barra de Chocolate',
      modality: 'buy',
      modalityicon: 'arrow-down-circle',
      datetransaction: '01/04/2024',
      amount: 5,
      price: '50',
      ispaid: true
    },
    {
      id: '2',
      description: 'Bombom',
      modality: 'sell',
      modalityicon: 'arrow-up-circle',
      datetransaction: '03/04/2024',
      amount: 5,
      price: '50',
      ispaid: true
    },
    {
      id: '3',
      description: 'Barra de Chocolate',
      modality: 'buy',
      modalityicon: 'arrow-down-circle',
      datetransaction: '01/04/2024',
      amount: 5,
      price: '50',
      ispaid: true
    },
    {
      id: '4',
      description: 'Bombom',
      modality: 'buy',
      modalityicon: 'arrow-down-circle',
      datetransaction: '01/04/2024',
      amount: 5,
      price: '50',
      ispaid: true
    },
    {
      id: '5',
      description: 'Barra de Chocolate',
      modality: 'buy',
      modalityicon: 'arrow-down-circle',
      datetransaction: '01/04/2024',
      amount: 5,
      price: '50',
      ispaid: true
    },
    {
      id: '6',
      description: 'Bombom',
      modality: 'buy',
      modalityicon: 'arrow-down-circle',
      datetransaction: '01/04/2024',
      amount: 5,
      price: '50',
      ispaid: true
    },
  ]

  async function loadSales() {
    const responseSales = await AsyncStorage.getItem(keySale)
    const listSales: ISale[] = responseSales ? JSON.parse(responseSales) : []
    listSales.map(ls => (
      {
        id: ls.id,
        name: 'Vendas',
        product: ls.product?.category?.name +' - '+ ls.product?.name,
      }
    ))
  }

  async function loadBuys() {}

  return (
    <Container>
      <HightLightCards>
        <HightLightCard
          modality="sell"
          title="Vendas"
          price="50"
          lastTransaction="Ultima venda dia xx/xx/xxxx"
        />
        <HightLightCard
          modality="buy"
          title="Compras"
          price="50"
          lastTransaction="Ultima compra dia xx/xx/xxxx"
        />
        <HightLightCard
          modality="total"
          title="Saldo"
          price="0"
          lastTransaction="de 01 a xx/xx/xxxx"
        />
      </HightLightCards>

      <Content style={{ height: newHeight }}>
        <Title>Listagem:</Title>
        {transactionView.length > 0 ?
          <FlatList
            data={transactionView}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              <Pressable onPress={() => { }}>
                <TransactionCard data={item} />
              </Pressable>
            }
          />
          :
          <Title>Não há compras ou vendas no momento</Title>
        }
      </Content>
    </Container>
  )
}