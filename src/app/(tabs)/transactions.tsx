import { useState, useEffect } from 'react';
import { useTheme } from 'styled-components';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { useWindowDimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IBuy, ISale, ITransaction } from '../../utils/interface'

import { keyBuy, keySale } from '../../utils/keyStorage';
import {
  Container,
  BlockBuy,
  BlockSale,
  ContainerGraphic,
  BlockResume,
  Title,
  GroupTextResume,
  TextResume
} from '../styles/transactionStyle'

export default function Transactions() {
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const heightBuy = height * 0.3
  const heightSale = height * 0.3
  const heightResume = height * 0.2
  const [transactionsList, setTransactionsList] = useState<ITransaction[]>([]);
  const [priceBuy, setPriceBuy] = useState(0)
  const [priceSale, setPriceSale] = useState(0)
  const [priceFinal, setPriceFinal] = useState(0)
  const [resumePriceBuy, setResumePriceBuy] = useState('')
  const [resumePriceSale, setResumePriceSale] = useState('')
  const [resumePriceFinal, setResumePriceFinal] = useState('')

  async function loadBuys() {
    let priceAccumulator = 0
    const responseBuys = await AsyncStorage.getItem(keyBuy)
    const listBuys: IBuy[] = responseBuys ? JSON.parse(responseBuys) : []
    let arrayNewTransaction: ITransaction[] = listBuys.map(lb => {
      priceAccumulator += lb.price
      return {
        id: String(lb.id),
        description: lb.name,
        modality: 'buy',
        color: theme.colors.buy,
        datetransaction: lb.datebuy,
        amount: lb.amount,
        price: String(lb.price)
      }
    })
    setPriceBuy(priceAccumulator)
    setResumePriceBuy(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceBuy))
    setTransactionsList(arrayNewTransaction)
  }

  async function loadSales() {
    let priceAccumulator = 0
    const responseSales = await AsyncStorage.getItem(keySale)
    const listSales: ISale[] = responseSales ? JSON.parse(responseSales) : []
    const filteredSales = listSales.filter(ls => ls.isPaid === false)
    let arrayNewTransaction: ITransaction[] = filteredSales.map(ls => {
      priceAccumulator += ls.price
      return {
        id: String(ls.id),
        description: ls.product?.category?.name + ' - ' + ls.product?.name,
        modality: 'sale',
        color: theme.colors.sale,
        datetransaction: ls.dateSale,
        amount: ls.amount,
        price: String(ls.price)
      }
    })
    setPriceSale(priceAccumulator)
    setResumePriceSale(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceSale))
    setTransactionsList(arrayNewTransaction)
  }

  function loadTransaction() {
    const price = priceSale - priceBuy
    setResumePriceFinal(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price))
  }

  useEffect(() => {
    loadBuys()
    loadSales()
    loadTransaction()
  }, [])

  const sampleData = [
    { x: "Jan", y: 200 },
    { x: "Fev", y: 333 },
    { x: "Mar", y: 525 },
    { x: "Abr", y: 410 },
    { x: "Mai", y: 315 },
    { x: "Jun", y: 800 }
  ]

  const dataSale = [
    { x: "Jan", y: 200 },
    { x: "Fev", y: 333 },
    { x: "Mar", y: 525 },
    { x: "Abr", y: 410 },
    { x: "Mai", y: 625 }
  ]

  return (
    <Container height={height}>
      <BlockBuy height={heightBuy}>
        <Title>COMPRAS:</Title>
        <ContainerGraphic>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={10}
            height={250}
            padding={{ top: 20, bottom: 80, left: 30, right: 50 }}
          >
            <VictoryBar
              style={{ data: { fill: theme.colors.buy } }}
              data={sampleData}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          </VictoryChart>
        </ContainerGraphic>
      </BlockBuy>

      <BlockSale height={heightSale}>
        <Title>VENDAS:</Title>
        <ContainerGraphic>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={10}
            height={250}
            padding={{ top: 20, bottom: 80, left: 30, right: 50 }}
          >
            <VictoryBar
              style={{ data: { fill: theme.colors.sale } }}
              data={dataSale}
              animate={{
                duration: 2000,
                onLoad: { duration: 1000 }
              }}
            />
          </VictoryChart>
        </ContainerGraphic>
      </BlockSale>

      <BlockResume height={heightResume}>
        <Title>RESUMO:</Title>
        <ContainerGraphic>
          <GroupTextResume>
            <TextResume bold={600}>Compras:</TextResume>
            <TextResume>{resumePriceBuy}</TextResume>
          </GroupTextResume>
          <GroupTextResume>
            <TextResume bold={600}>Vendas:</TextResume>
            <TextResume>{resumePriceSale}</TextResume>
          </GroupTextResume>
          <GroupTextResume>
            <TextResume bold={600}>Saldo:</TextResume>
            <TextResume>{resumePriceFinal}</TextResume>
          </GroupTextResume>
        </ContainerGraphic>
      </BlockResume>
    </Container>
  )
}
