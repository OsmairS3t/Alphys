import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useTheme } from 'styled-components';
import HeaderModal from '../../components/HeaderModal';
import { InputForm } from '../../components/Forms/InputForm';
import { SelectList } from 'react-native-dropdown-select-list'
import { ISelectProps, IStock } from '../../../utils/interface';
import { ButtonForm, TextButton } from '../../styles/global';
import { Container, TitleModal } from '../../styles/stockStyle';
import { useStockDatabase } from '../../../hooks/useStockDatabase';
import { useProductDatabase } from '../../../hooks/useProductDatabase';

type StockProps = {
  closeModal: (value: boolean) => void;
  updateList: () => void;
  stock: IStock | undefined;
}

export default function RegisterStock({ closeModal, updateList, stock }: StockProps) {
  const theme = useTheme();
  let title_page = stock ? 'EDITAR CADASTRO' : 'NOVO CADASTRO'
  const stockDatabase = useStockDatabase()
  const productDatabase = useProductDatabase()
  const [selected, setSelected] = useState('');
  const [amount, setAmount] = useState('');
  const [initialValue, setInitialValue] = useState<ISelectProps>({ key: '', value: '' })
  const [data, setData] = useState<ISelectProps[]>([]);

  async function loadProduct(idProduct: number) {
    const response = await productDatabase.searchById(idProduct)
    return response
  }

  async function handleSave() {
    const objProduct = await loadProduct(Number(selected))
    try {
      // localiza o produto na coleção existente para não duplicar
      const updateData = await stockDatabase.searchByProductId(Number(selected))
      if (!updateData) {
        // se não tem inclui como novo
        await stockDatabase.create({
          product_id: Number(objProduct?.id),
          product_name: String(objProduct?.name),
          amount: Number(amount),
          hasstock: (Number(amount) > 0) ? true : false
        })
        Alert.alert('Produto incluído no estoque com sucesso!')
      } else {
        // caso encontre, remove da coleção e inclui o novo com nova quantidade
        await stockDatabase.update({
          id: updateData.id,
          product_id: updateData.product_id,
          product_name: updateData.product_name,
          amount: Number(amount),
          hasstock: (Number(amount) > 0) ? true : false
        })
        Alert.alert('Quantidade do produto no estoque alterada com sucesso!')
      }
      updateList();
      closeModal(false);
    } catch (error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  async function LoadProductSelect() {
    try {
      const response = await productDatabase.find()
      if(response) {
        let newArray: ISelectProps[] = response.map(dp => {
          return { key: String(dp.id), value: dp.categoryname + ' - ' + dp.name }
        })
        setData(newArray)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function LoadProductSelected() {
    try {
      if(stock) {
        let newArray: ISelectProps[] = [
          {
            key: String(stock.product_id),
            value: stock.product_name
          }
        ]
        setData(newArray)
        setAmount(String(stock.amount))
        setInitialValue(newArray[0])
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (stock) {
      LoadProductSelect()
    } else {
      LoadProductSelected()
    }
  }, [])

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='ESTOQUE DE PRODUTOS' />

      <TitleModal>{title_page}</TitleModal>
      <SelectList
        placeholder='Informe o Produto'
        boxStyles={{ backgroundColor: theme.colors.bg_input, marginBottom: 10 }}
        dropdownStyles={{ backgroundColor: theme.colors.bg_input }}
        setSelected={(selected: string) => setSelected(selected)}
        defaultOption={initialValue}
        data={data}
        save="key"
      />

      <InputForm
        placeholder='Quantidade'
        keyboardType='numeric'
        onChangeText={text => setAmount(text)}
        value={amount}
      />

      <ButtonForm onPress={handleSave}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>
    </Container>
  )
}
