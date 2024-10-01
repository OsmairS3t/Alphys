import { useState, useEffect, useContext } from 'react';
import { useWindowDimensions, Alert } from 'react-native';
import { LoadingContext } from '../../loadingContext';
import { useTheme } from 'styled-components';
import { VictoryBar, VictoryChart, VictoryTheme } from 'victory-native';
import { ITransaction } from '../../utils/interface'
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
import { useTransactionDatabase } from '../../hooks/useTransactionDatabase';

export default function Transactions() {
  const { isLoading, showLoading, hideLoading } = useContext(LoadingContext);
  const theme = useTheme();
  const transactionDatabase = useTransactionDatabase()
  const { height } = useWindowDimensions();
  const heightBuy = height * 0.3
  const heightSale = height * 0.2
  const heightResume = height * 0.2
  const [transactionsList, setTransactionsList] = useState<ITransaction[]>([]);
  const [isPay, setIsPay] = useState(false)
  const [priceBuy, setPriceBuy] = useState(0)
  const [priceSale, setPriceSale] = useState(0)
  const [resumePriceBuy, setResumePriceBuy] = useState('')
  const [resumePriceSale, setResumePriceSale] = useState('')
  const [resumePriceFinal, setResumePriceFinal] = useState('')
  const sampleData = [
    { x: "Jan", y: 200 },
    { x: "Fev", y: 333 },
    { x: "Mar", y: 525 },
    { x: "Abr", y: 410 },
    { x: "Mai", y: 315 },
    { x: "Jun", y: 800 },
    { x: "Jul", y: 650 },
    { x: "Ago", y: 700 },
    { x: "Set", y: 600 },
    { x: "Out", y: 400 },
    { x: "Nov", y: 500 },
    { x: "Dez", y: 1500 }
  ]
  const dataSale = [
    { x: "Jan", y: 200 },
    { x: "Fev", y: 333 },
    { x: "Mar", y: 525 },
    { x: "Abr", y: 410 },
    { x: "Mai", y: 625 }
  ]

  async function loadBuys() {
    if (isLoading) {
      Alert.alert('Testando contexto Carregando')
    }
    let priceAccumulator = 0
    try {
      const responseBuys = await transactionDatabase.searchByModality('buy')
      responseBuys.map(lb => {
        priceAccumulator += lb.price
      })
      setPriceBuy(priceAccumulator)
      setResumePriceBuy(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceBuy))
      setTransactionsList(responseBuys)
    } catch (error) {
      console.log(error)
    }
  }

  async function loadSales() {
    try {
      let priceAccumulator = 0
      const filteredSales = await transactionDatabase.searchSalesPay(isPay)
      filteredSales.map(item => {
        priceAccumulator += item.price
      })
      setPriceSale(priceAccumulator)
      setResumePriceSale(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceSale))
      setTransactionsList(filteredSales)
    } catch (error) {
      console.log(error)      
    }
  }

  useEffect(() => {
    loadBuys();
    loadSales();
    const price = priceSale - priceBuy
    setResumePriceFinal(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price))
  }, [])

  return (
    <Container height={height}>
      <BlockBuy height={heightBuy}>
        <Title>COMPRAS:</Title>
        <ContainerGraphic>
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={10}
            height={200}
            padding={{ top: 10, bottom: 100, left: 50, right: 50 }}
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
            height={200}
            padding={{ top: 10, bottom: 100, left: 50, right: 50 }}
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
            <TextResume bold={800}>Compras:</TextResume>
            <TextResume>{resumePriceBuy}</TextResume>
          </GroupTextResume>
          <GroupTextResume>
            <TextResume bold={800}>Vendas:</TextResume>
            <TextResume>{resumePriceSale}</TextResume>
          </GroupTextResume>
          <GroupTextResume>
            <TextResume bold={800}>Saldo:</TextResume>
            <TextResume>{resumePriceFinal}</TextResume>
          </GroupTextResume>
        </ContainerGraphic>
      </BlockResume>
    </Container>
  )
}
