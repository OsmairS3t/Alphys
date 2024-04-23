import React, { useState } from 'react';
import { Modal } from 'react-native';

import Category from '../screens/category';
import Product from '../screens/product';
import Buy from '../screens/buy';
import Sale from '../screens/sale';
import Client from '../screens/client';

import { Container, Title, ListGroup, ItemList, Item, TextItem } from '../styles/registerStyle';

export default function Register() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)

  function handleModalRegister(typeRegister: string) {
    if(typeRegister === 'category') {setIsCategoryModalOpen(true)}
    if(typeRegister === 'product') {setIsProductModalOpen(true)}
    if(typeRegister === 'buy') {setIsBuyModalOpen(true)}
    if(typeRegister === 'sale') {setIsSaleModalOpen(true)}
    if(typeRegister === 'client') {setIsClientModalOpen(true)}
  }

  return (
    <Container>
      <Title>Cadastros:</Title>
      <ListGroup>
        <ItemList>
          <Item onPress={() => handleModalRegister('category')}>
            <TextItem>CATEGORIAS</TextItem>
          </Item>
          <Item onPress={() => handleModalRegister('product')}>
            <TextItem>PRODUTOS</TextItem>
          </Item>
          <Item onPress={() => handleModalRegister('buy')}>
            <TextItem>COMPRAS</TextItem>
          </Item>
          <Item onPress={() => handleModalRegister('sale')}>
            <TextItem>VENDAS</TextItem>
          </Item>
          <Item onPress={() => handleModalRegister('client')}>
            <TextItem>CLIENTES</TextItem>
          </Item>
        </ItemList>
      </ListGroup>

      <Modal 
        animationType='slide' 
        presentationStyle='pageSheet'
        visible={isCategoryModalOpen} 
        onRequestClose={() => {
          setIsCategoryModalOpen(!isCategoryModalOpen)
        }}>
        <Category closeModal={setIsCategoryModalOpen} />
      </Modal>

      <Modal 
        animationType='slide' 
        presentationStyle='pageSheet'
        visible={isProductModalOpen} 
        onRequestClose={() => {
          setIsProductModalOpen(!isProductModalOpen)
        }}>
        <Product closeModal={setIsProductModalOpen} />
      </Modal>

      <Modal 
        animationType='slide' 
        presentationStyle='pageSheet'
        visible={isBuyModalOpen} 
        onRequestClose={() => {
          setIsBuyModalOpen(!isBuyModalOpen)
        }}>
        <Buy closeModal={setIsBuyModalOpen} />
      </Modal>

      <Modal 
        animationType='slide' 
        presentationStyle='pageSheet'
        visible={isSaleModalOpen} 
        onRequestClose={() => {
          setIsSaleModalOpen(!isSaleModalOpen)
        }}>
        <Sale closeModal={setIsSaleModalOpen} />
      </Modal>

      <Modal 
        animationType='slide' 
        presentationStyle='pageSheet'
        visible={isClientModalOpen} 
        onRequestClose={() => {
          setIsClientModalOpen(!isClientModalOpen)
        }}>
        <Client closeModal={setIsClientModalOpen} />
      </Modal>
    </Container>
  )
}
