import React, { useState } from 'react';
import { Modal } from 'react-native';

import Category from '../screens/category';
import Product from '../screens/product';
import Buy from '../screens/buy';
import Sale from '../screens/sale';
import Client from '../screens/client';
import Stock from '../screens/stock';

import { Container, Title, ListGroup, ItemList, Item, TextItem, GroupList, IconList } from '../styles/registerStyle';
import Recipe from '../screens/recipe';

export default function Register() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false)
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false)

  function handleModalRegister(typeRegister: string) {
    if (typeRegister === 'category') { setIsCategoryModalOpen(true) }
    if (typeRegister === 'product') { setIsProductModalOpen(true) }
    if (typeRegister === 'buy') { setIsBuyModalOpen(true) }
    if (typeRegister === 'sale') { setIsSaleModalOpen(true) }
    if (typeRegister === 'client') { setIsClientModalOpen(true) }
    if (typeRegister === 'stock') { setIsStockModalOpen(true) }
    if (typeRegister === 'recipe') { setIsRecipeModalOpen(true) }
  }

  return (
    <Container>
      <Title>Cadastros:</Title>
      <ItemList>
        <Item onPress={() => handleModalRegister('category')}>
          <GroupList>
            <IconList name='category' size={32} />
            <TextItem>CATEGORIAS</TextItem>
          </GroupList>
        </Item>
        <Item onPress={() => handleModalRegister('product')}>
          <GroupList>
            <IconList name='fastfood' size={32} />
            <TextItem>PRODUTOS</TextItem>
          </GroupList>
        </Item>
        <Item onPress={() => handleModalRegister('buy')}>
          <GroupList>
            <IconList name='shopping-cart' size={32} />
            <TextItem>COMPRAS</TextItem>
          </GroupList>
        </Item>
        <Item onPress={() => handleModalRegister('sale')}>
          <GroupList>
            <IconList name='sell' size={32} />
            <TextItem>VENDAS</TextItem>
          </GroupList>
        </Item>
        <Item onPress={() => handleModalRegister('client')}>
          <GroupList>
            <IconList name='emoji-people' size={32} />
            <TextItem>CLIENTES</TextItem>
          </GroupList>
        </Item>
        <Item onPress={() => handleModalRegister('stock')}>
          <GroupList>
            <IconList name='add-business' size={32} />
            <TextItem>ESTOQUE</TextItem>
          </GroupList>
        </Item>
        <Item onPress={() => handleModalRegister('recipe')}>
          <GroupList>
            <IconList name='list-alt' size={32} />
            <TextItem>RECEITAS</TextItem>
          </GroupList>
        </Item>
      </ItemList>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isCategoryModalOpen}
        onRequestClose={() => {
          setIsCategoryModalOpen(!isCategoryModalOpen)
        }}>
        <Category closeModal={setIsCategoryModalOpen} />
      </Modal>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isProductModalOpen}
        onRequestClose={() => {
          setIsProductModalOpen(!isProductModalOpen)
        }}>
        <Product closeModal={setIsProductModalOpen} />
      </Modal>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isBuyModalOpen}
        onRequestClose={() => {
          setIsBuyModalOpen(!isBuyModalOpen)
        }}>
        <Buy closeModal={setIsBuyModalOpen} />
      </Modal>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isSaleModalOpen}
        onRequestClose={() => {
          setIsSaleModalOpen(!isSaleModalOpen)
        }}>
        <Sale closeModal={setIsSaleModalOpen} />
      </Modal>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isClientModalOpen}
        onRequestClose={() => {
          setIsClientModalOpen(!isClientModalOpen)
        }}>
        <Client closeModal={setIsClientModalOpen} />
      </Modal>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isStockModalOpen}
        onRequestClose={() => {
          setIsStockModalOpen(!isStockModalOpen)
        }}>
        <Stock closeModal={setIsStockModalOpen} />
      </Modal>

      <Modal
        transparent={true}
        animationType='slide'
        visible={isRecipeModalOpen}
        onRequestClose={() => {
          setIsRecipeModalOpen(!isRecipeModalOpen)
        }}>
        <Recipe closeModal={setIsRecipeModalOpen} />
      </Modal>
    </Container>
  )
}
