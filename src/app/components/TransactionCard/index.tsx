import React from 'react';
import { ITransactionViewProps } from '../../../utils/interface';

import { 
  Container,
  Header,
  Content,
  Title,
  Amount,
  Price,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from './styles';

interface Category {
  name: string;
  icon: string;
}

interface Props {
  data: ITransactionViewProps;
}

export function TransactionCard({ data }: Props) {
  //console.log(data)
  const dataFormatted = {
    id: data.id,
    description: data.description,
    modality: data.modality,
    modalityicon: data.modalityicon,
    datetransaction: data.datetransaction,
    amount: data.amount,
    price: data.price,
    ispaid: data.ispaid
  }

  return (
    <Container>
      <Header>
        <Title>{dataFormatted.description}</Title>
      </Header>

      <Content>
        <Price modality={dataFormatted.modality}>
          {dataFormatted.modality === 'buy' && '- ' }
          {dataFormatted.price}
        </Price>
        <Amount>Qtd: {dataFormatted.amount}</Amount>
      </Content>

      <Footer>
        <Category>
          <Icon name={dataFormatted.modalityicon} />
          <CategoryName>{dataFormatted.modality === 'buy' ? 'Compras' : 'Vendas'}</CategoryName>
        </Category>
        <Date>{dataFormatted.datetransaction}</Date>
      </Footer>
    </Container>
  )
}