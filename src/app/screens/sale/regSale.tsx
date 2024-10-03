import React, { useEffect, useState } from 'react';
import { Alert, Switch, Text, View } from 'react-native';
import { useTheme } from 'styled-components';
import HeaderModal from '../../components/HeaderModal';

import { IClient, IProduct, ISelectProps, IStock, ITransaction } from '../../../utils/interface';
// import { clients, products } from '../../utils/database';

import uuid from 'react-native-uuid';
import { InputForm } from '../../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list';

import { keyClient, keyProduct, keySale, keyStock } from '../../../utils/keyStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { actualDate } from '../../../utils/functions';

import {
  ContainerModal,
  GroupColumn,
  GroupIconTextRow,
  ItemColumnList,
  TextColumnList,
  IconColumnList
} from '../../styles/registerStyle';
import { Container, Title, GroupSwitch, TitleSwitch, TextSwitch, GroupInput, GroupAmount, ItemAmount } from '../../styles/saleStyle';
import { ButtonForm, TextButton } from '../../styles/global';
import { useTransactionDatabase } from '../../../hooks/useTransactionDatabase';
import { useProductDatabase } from '../../../hooks/useProductDatabase';
import { useClientDatabase } from '../../../hooks/useClientDatabase';
import { useStockDatabase } from '../../../hooks/useStockDatabase';

type SaleProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  sale: ITransaction | undefined;
}

export default function RegisterSale({ closeModal, updateList, sale }: SaleProps) {
  const theme = useTheme();
  let title_page = sale ? 'VER VENDA' : 'NOVA VENDA'
  const transactionDatabase = useTransactionDatabase()
  const productDatabase = useProductDatabase()
  const clientDatabase = useClientDatabase()
  const stockDatabase = useStockDatabase()
  const [dataClient, setDataClient] = useState<ISelectProps[]>([{ key: '', value: '' }]);
  const [dataProduct, setDataProduct] = useState<ISelectProps[]>([{ key: '', value: '' }]);
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedProduct, setSelectedProduct] = useState("")
  const [amountStock, setAmountStock] = useState('');
  const [priceProduct, setPriceProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [clientSale, setClientSale] = useState('')
  const [productSale, setProductSale] = useState('')
  const [amountSale, setAmountSale] = useState('')
  const [priceSale, setPriceSale] = useState('')
  const [isPaidSale, setIsPaidSale] = useState(false)
  const [dataSale, setDataSale] = useState('')

  async function loadClient(idClient: number) {
    const response:IClient = await clientDatabase.searchById(idClient)
    return response
  }

  async function loadProduct(idProduct: number) {
    const response:IProduct = await productDatabase.searchById(idProduct)
    return response
  }

  async function loadStockProduct(idProduct: number) {
    const response = await stockDatabase.searchByProductId(idProduct)
    const stockProduct = await productDatabase.searchById(idProduct)
    setAmountStock(String(response?.amount))
    setPriceProduct(String(stockProduct?.price))
  }

  async function loadSelectClients() {
    const response = await clientDatabase.find()
    if(response) {
      let newArray: ISelectProps[] = response.map(cli => {
        return { key: String(cli.id), value: String(cli.name) }
      })
      setDataClient(newArray)
    }
  }

  async function loadSelectProducts() {
    const response = await productDatabase.find()
    if(response) {
      let newArray: ISelectProps[] = response.map(ds => {
        return { key: String(ds.id), value: String(ds.categoryname + ' - ' + ds.name) }
      })
      setDataProduct(newArray)
    }
  }

  async function loadSales(id: number) {
    //listar tambem apenas os que não foram pagos
    const response = await transactionDatabase.searchByModality('sale')
    if(response) {
      const foundSales = response.find(ds => ds.id === id)
      setClientSale(String(foundSales?.client_name))
      setProductSale(String(foundSales?.product_name))
      setAmountSale(String(foundSales?.amount))
      setPriceSale(String(foundSales?.price))
      setIsPaidSale(Boolean(foundSales?.ispaid))
      setDataSale(String(foundSales?.datetransaction))
    }
  }

  async function handleSave() {
    let objProduct= await loadProduct(Number(selectedProduct))
    let objClient = await loadClient(Number(selectedClient))
    let stockId = 0
    try {
      //localizar produto no estoque pra ver se tem estoque suficiente e salva novo estoque
      const dataStock:IStock = await stockDatabase.searchByProductId(Number(selectedProduct))
      if(dataStock) {
        stockId = dataStock.id
        if(dataStock.amount < Number(amount)) {
          Alert.alert('Não há quantidade disponível para este produto.')
          return false;
        } else {
          //diminuir quantidade no estoque
          const newAmount = Number(dataStock.amount) - Number(amount)
          await stockDatabase.update({
            id: dataStock.id,
            product_id: dataStock.product_id,
            product_name: objProduct.categoryname +'-'+ objProduct.name,
            amount: newAmount,
            hasstock: newAmount > 0 ? true : false
          })
        }
      }
      //salvar venda do produto
      await transactionDatabase.create({
        modality: 'sale',
        kind: '',
        place: '',
        product_name: objProduct.categoryname + '-'+ objProduct.name,
        client_name: objClient.name,
        amount: Number(amount),
        price: objProduct.price * Number(amount),
        datetransaction: actualDate(),
        ispaid: isPaid,
        stock_id: stockId
      })
      Alert.alert('Venda incluída com sucesso!')
      updateList();
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    if(sale) {
      loadSales(sale.id)
    }
    loadSelectClients()
    loadSelectProducts()
  }, [])

  if(sale) {
    return (
      <Container>
        <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE VENDAS' />
        <Title>{title_page}</Title>
        <ItemColumnList>
          <TextColumnList>Cliente: {clientSale}</TextColumnList>
          <TextColumnList>Produto: {productSale}</TextColumnList>
          <TextColumnList>Quant.: {amountSale}</TextColumnList>
          <TextColumnList>
            Valor: {Intl
              .NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
              .format(Number(priceSale))}
          </TextColumnList>
          <TextColumnList>Situação: {isPaidSale ? 'Pago' : 'A pagar'}</TextColumnList>
          <TextColumnList>Data: {dataSale}</TextColumnList>
        </ItemColumnList>
      </Container>
    )
  } else {
    return (
      <Container>
        <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE VENDAS' />
            
          <Title>{title_page}</Title>
          <SelectList
            placeholder='Cliente'
            boxStyles={{ backgroundColor: theme.colors.bg_input, marginBottom: 10 }}
            dropdownStyles={{ backgroundColor: theme.colors.bg_input }}
            setSelected={(val: string) => setSelectedClient(val)}
            data={dataClient}
            save="key"
          />
  
          <SelectList
            placeholder='Produto'
            boxStyles={{ backgroundColor: theme.colors.bg_input, marginBottom: 10 }}
            dropdownStyles={{ backgroundColor: theme.colors.bg_input }}
            setSelected={(val: string) => setSelectedProduct(val)}
            data={dataProduct}
            save="key"
            onSelect={() => loadStockProduct(Number(selectedProduct))}
          />
  
          <GroupInput>
            <InputForm
              placeholder='Quantidade'
              keyboardType='numeric'
              onChangeText={text => setAmount(text)}
              value={amount}
              style={{ width: 200 }}
            />
            <GroupAmount>
              <ItemAmount>Estoque: {amountStock}</ItemAmount>
            </GroupAmount>
          </GroupInput>
  
          <GroupSwitch>
            <TitleSwitch>Situação:</TitleSwitch>
            <Switch
              style={{ width: 50 }}
              trackColor={{ false: '#c4c4c4', true: '#c4c4c4' }}
              thumbColor={isPaid ? '#018597' : '#f35e5e'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setIsPaid}
              value={isPaid}
            />
            <TextSwitch isPaid={isPaid}>{isPaid ? 'Pago' : 'A pagar'}</TextSwitch>
          </GroupSwitch>
  
          <ButtonForm onPress={handleSave}>
            <TextButton>Salvar</TextButton>
          </ButtonForm>
      </Container>
    )
  }
}
