import { useState, useEffect, useContext } from 'react';
import { LineChart } from 'react-native-chart-kit'
import { useWindowDimensions, Alert, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import { LoadingContext } from '../../loadingContext';
import { useTheme } from 'styled-components';
import { useTransactionDatabase } from '../../hooks/useTransactionDatabase';
import { IBuySelData, ITransaction } from '../../utils/interface'
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
interface Transaction {
  datetransaction: string;
  price: number;
}

interface Accumulator {
  [key: string]: number;  // Chaves são strings (datas), valores são números (total por data)
}

export default function Transactions() {
  const { isLoading, showLoading, hideLoading } = useContext(LoadingContext);
  const { height, width } = useWindowDimensions();
  const theme = useTheme();
  const transactionDatabase = useTransactionDatabase()
  const [dataBuy, setDataBuy] = useState<IBuySelData>({
    labels: [''],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(242, 121, 0, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["COMPRAS"]
  })
  const [dataSale, setDataSale] = useState<IBuySelData>({
    labels: [''],
    datasets: [
      {
        data: [0],
        color: (opacity = 1) => `rgba(242, 121, 0, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["VENDAS"]
  })
  const [saldo, setSaldo] = useState<TChart>()
  const heightBuy = height * 0.3
  const chartConfigCompra = {
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#fb8c00",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 2, // optional, defaults to 2dp
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726"
    }
  };
  const chartConfigVenda = {
    backgroundGradientFrom: "#009141",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#009744",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };

  function loadBuySale(transactions: Transaction[]) {
    const summedTransactions = transactions.reduce<Accumulator>((acc, current) => {
      if (acc[current.datetransaction]) {
        acc[current.datetransaction] += current.price;
      } else {
        acc[current.datetransaction] = current.price;
      }
      return acc;
    }, {});
    return summedTransactions
  }

  async function loadTransactions() {
    try {
      const listVendas = await transactionDatabase.listByModality('sale')
      if (listVendas) {
        const sales: Accumulator = loadBuySale(listVendas)
        const data_vendas = Object.keys(sales)
        const valor_vendas = Object.values(sales)
        setDataBuy({
          labels: data_vendas,
          datasets: [
            {
              data: valor_vendas,
              color: (opacity = 1) => `rgba(242, 121, 0, ${opacity})`,
              strokeWidth: 2
            }
          ],
          legend: ["VENDAS"]
        })
      }

      const listCompras = await transactionDatabase.listByModality('buy')
      if (listCompras) {
        const buys: Accumulator = loadBuySale(listCompras)
        const data_compras = Object.keys(buys)
        const valor_compras = Object.values(buys)
        setDataSale({
          labels: data_compras,
          datasets: [
            {
              data: valor_compras,
              color: (opacity = 1) => `rgba(242, 121, 0, ${opacity})`,
              strokeWidth: 2
            }
          ],
          legend: ["COMPRAS"]
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  return (
    <Container height={height}>
      <BlockBuy height={heightBuy}>

        <ContainerGraphic>
          <LineChart
            data={dataBuy}
            width={width}
            height={250}
            verticalLabelRotation={10}
            chartConfig={chartConfigCompra}
            bezier
            yAxisLabel="R$"
          />
        </ContainerGraphic>

        <ContainerGraphic>
          <LineChart
            data={dataSale}
            width={width}
            height={200}
            verticalLabelRotation={10}
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
