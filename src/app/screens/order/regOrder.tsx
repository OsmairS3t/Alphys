import { useState, useEffect } from 'react';
import { Modal, Alert } from 'react-native';
import { useTheme } from 'styled-components';
import FilterStock from '../../components/Filter/filterstock';
import { IOrder, ISelectProps } from '../../../utils/interface';
import { ButtonForm, InputMask, TextButton } from '../../styles/global'
import { Container, Title } from '../../styles/orderStyle'
import { SelectList } from 'react-native-dropdown-select-list';
import { InputForm } from '../../components/Forms/InputForm';
import HeaderModal from '../../components/HeaderModal';
import { useOrderDatabase } from '../../../hooks/useOrderDatabase';
import { useClientDatabase } from '../../../hooks/useClientDatabase';
import { useProductDatabase } from '../../../hooks/useProductDatabase';

type OrderProps = {
  closeModal: (value: boolean) => void;
  updateList: (type: string, id: string) => void;
  order: IOrder | undefined;
}

export default function RegisterOrder({ closeModal, updateList, order }: OrderProps) {
  let title_page = order ? 'EDITAR CADASTRO' : 'NOVO CADASTRO'
  const theme = useTheme()
  const orderDatabase = useOrderDatabase()
  const clientDatabase = useClientDatabase()
  const productDatabase = useProductDatabase()
  const [dataClient, setDataClient] = useState<ISelectProps[]>([{ key: '', value: '' }]);
  const [dataProduct, setDataProduct] = useState<ISelectProps[]>([{ key: '', value: '' }]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [obs, setObs] = useState('')

  async function loadClientOnce(idClient: number) {
    const response = await clientDatabase.searchById(idClient)
    if(response) {
      return response.name
    } else {
      return ''
    }
  }

  async function loadClients() {
    try {
      const response = await clientDatabase.searchByName('')
      let newArray: ISelectProps[] = response.map(cli => {
        return { key: String(cli.id), value: String(cli.name) }
      })
      setDataClient(newArray)
    } catch (e) {
      console.log(e)
    }
  }

  async function loadProductOnce(idProduct: number) {
    const response = await productDatabase.searchById(idProduct)
    if(response) {
      return response.name
    } else {
      return ''
    }
  }

  async function loadProducts() {
    try {
      const response = await productDatabase.searchByName('')
      let newArray: ISelectProps[] = response.map(pro => {
        return { key: String(pro.id), value: String(pro.categoryname) +' - '+ String(pro.name) }
      })
      setDataProduct(newArray)
    } catch (e) {
      console.log(e)
    }
  }

  async function handleSave() {
    try {
      await orderDatabase.create({
        client_name: await loadClientOnce(Number(selectedClient)),
        product_name: await loadProductOnce(Number(selectedProduct)),
        amount: Number(amount),
        price: Number(price),
        obs: obs
      })
      Alert.alert('Encomenda incluída com sucesso!')   
      closeModal(false) 
    } catch(error) {
      console.log('Ocorreu um erro ao tentar salvar: ', error)
    }
  }

  useEffect(() => {
    loadClients()
    loadProducts()
  }, [])

  return (
    <Container>
      <HeaderModal closeModal={() => closeModal(false)} titleModal='CADASTRO DE ENCOMENDAS' />

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
      />

      <InputForm
          placeholder='Quantidade'
          keyboardType='numeric'
          onChangeText={text => setAmount(text)}
          value={amount}
        />

      <InputMask
        type='currency'
        options={{
          prefix: '',
          precision: 2,
          decimalSeparator: '.',
          groupSeparator: ',',
        }}
        placeholder='0.00'
        keyboardType='numeric'
        onChangeText={(text, rawText) => {
          setPrice(text)
        }}
      />

      <InputForm
          placeholder='Observação'
          keyboardType='default'
          onChangeText={text => setObs(text)}
          value={obs}
        />

      <ButtonForm onPress={handleSave}>
        <TextButton>Salvar</TextButton>
      </ButtonForm>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isDetailModalOpen}
        onRequestClose={() => {
          setIsDetailModalOpen(!isDetailModalOpen)
        }}>
        <FilterStock closeModal={setIsDetailModalOpen} />
      </Modal>

    </Container>
  )
}