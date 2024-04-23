import React from 'react';
import {
  Container,
  Header,
  Footer,
  Price,
  LastTransaction,
  Icon,
  Title
} from './styles';

interface Props {
  title: string;
  price: string;
  lastTransaction: string;
  modality: 'sell' | 'buy' | 'total';
}

const icon = {
  sell: 'arrow-up-circle',
  buy: 'arrow-down-circle',
  total: 'dollar-sign'
}

export function HightLightCard({ modality, title, price, lastTransaction }: Props) {
  return (
    <Container modality={modality}>
      <Header>
        <Title modality={modality}>{title}</Title>
        <Icon name={icon[modality]} modality={modality}/>
      </Header>
      <Price>
        <Title modality={modality}>{price}</Title>
      </Price>
      <Footer>
        <LastTransaction>
          <Title modality={modality}>{lastTransaction}</Title>
        </LastTransaction>
      </Footer>
    </Container>
  )
}