import { useState, useEffect, useContext } from 'react';
import { LineChart } from 'react-native-chart-kit'
import { useWindowDimensions, Alert, View, Dimensions, Text } from 'react-native';
import { LoadingContext } from '../../loadingContext';
import { useTheme } from 'styled-components';
import { useTransactionDatabase } from '../../hooks/useTransactionDatabase';
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

type TChart = {
  labels: string[]
  values: number[]
}

export default function Transactions() {
  const { isLoading, showLoading, hideLoading } = useContext(LoadingContext);
  const theme = useTheme();
  const transactionDatabase = useTransactionDatabase()
  const { height, width } = useWindowDimensions();
  const [saldo, setSaldo] = useState<TChart[]>([])
  const [venda, setVenda] = useState<TChart[]>([])
  
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
  const chartConfigSaldo = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };
  const chartConfigVenda = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  async function loadTransactions() {
    try {
      const resumeSaldo = await transactionDatabase.resumeByData('05/07/2024')
      if(resumeSaldo) {
        console.log(resumeSaldo)
      } 
    } catch (error) {
      console.log(error)      
    }
  }

  async function loadBuys() {
    // if (isLoading) {
    //   Alert.alert('Testando contexto Carregando')
    // }
    let priceAccumulator = 0
    try {
      const responseBuys = await transactionDatabase.searchByModality('buy')
      if(responseBuys) {
        responseBuys.map(lb => {
          priceAccumulator += lb.price
        })
        setPriceBuy(priceAccumulator)
        setResumePriceBuy(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceBuy))
        setTransactionsList(responseBuys)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function loadSales() {
    try {
      let priceAccumulator = 0
      const filteredSales = await transactionDatabase.searchSalesPay(isPay)
      if(filteredSales) {
        filteredSales.map(item => {
          priceAccumulator += item.price
        })
        setPriceSale(priceAccumulator)
        setResumePriceSale(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(priceSale))
        setTransactionsList(filteredSales)
      }
    } catch (error) {
      console.log(error)      
    }
  }

  const saldoData = {
    labels: ["05/10/2024", "06/10/2024", "07/10/2024", "08/10/2024", "09/10/2024", "10/10/2024"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(242, 121, 0, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Saldo Diário"]
  };


  const vendaData = {
    labels: ["05/10/2024", "06/10/2024", "07/10/2024", "08/10/2024", "09/10/2024", "10/10/2024"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(242, 121, 0, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Saldo Diário"]
  };

  useEffect(() => {
    loadTransactions()
    // const price = priceSale - priceBuy
    // setResumePriceFinal(Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price))
  }, [])

  return (
    <Container height={height}>
      <BlockBuy height={heightBuy}>
        <Title>COMPRAS:</Title>

        <ContainerGraphic>
          <LineChart
            data={saldoData}
            width={width}
            height={200}
            verticalLabelRotation={30}
            chartConfig={chartConfigSaldo}
            bezier
          />
        </ContainerGraphic>

        <ContainerGraphic>
          <LineChart
            data={vendaData}
            width={width}
            height={200}
            verticalLabelRotation={30}
            chartConfig={chartConfigVenda}
            bezier
          />
        </ContainerGraphic>

        <ContainerGraphic>
          <Text>RESUMO:</Text>
        </ContainerGraphic>
      
      </BlockBuy>


    </Container>
  )
}
