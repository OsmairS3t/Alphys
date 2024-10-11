import { useState, useEffect, useContext } from 'react';
import { LineChart } from 'react-native-chart-kit'
import { useWindowDimensions, Alert, View, Dimensions, Text, TouchableOpacity } from 'react-native';
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
import { InputForm } from '../components/Forms/InputForm';
import { supabase } from '../../databases/supabase';

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
  const [dateTransac, setDateTransac] = useState('05/07/2024')
  const [compra, setCompra] = useState<TChart>({labels:[""], values: [0]})
  const [venda, setVenda] = useState<TChart>({labels:[""], values: [0]})
  const [saldo, setSaldo] = useState<TChart>()
  
  const heightBuy = height * 0.3
  const heightSale = height * 0.2
  const heightResume = height * 0.2
  const [transactionsList, setTransactionsList] = useState<ITransaction[]>([]);

  const [priceBuy, setPriceBuy] = useState(0)
  const [priceSale, setPriceSale] = useState(0)
  const [resumePriceBuy, setResumePriceBuy] = useState('')
  const [resumePriceSale, setResumePriceSale] = useState('')
  const [resumePriceFinal, setResumePriceFinal] = useState('')

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

  function loadBuySale(transactions:Transaction[]) {
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
      if(listVendas) {
        const sales:Accumulator = loadBuySale(listVendas)
        const data_vendas =  Object.keys(sales)
        const valor_vendas =  Object.values(sales)
        setVenda({labels: data_vendas, values: valor_vendas})
      }
      
      const listCompras = await transactionDatabase.listByModality('buy')
      if(listCompras) {
        const buys:Accumulator = loadBuySale(listCompras)
        const data_compras =  Object.keys(buys)
        const valor_compras =  Object.values(buys)
        setCompra({labels: data_compras, values: valor_compras})
      }
    } catch (error) {
      console.log(error)      
    }
  }

  const compraData = {
    labels: compra?.labels,
    datasets: [
      {
        data: compra?.values,
        color: (opacity = 1) => `rgba(242, 121, 0, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["COMPRAS"]
  };

  const vendaData = {
    labels: venda?.labels,
    datasets: [
      {
        data: venda?.values,
        color: (opacity = 1) => `rgba(242, 121, 0, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["VENDAS"]
  };

  useEffect(() => {
    loadTransactions()
  }, [])

  return (
    <Container height={height}>
      <BlockBuy height={heightBuy}>

        <ContainerGraphic>
          <LineChart
            data={compraData}
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
            data={vendaData}
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
