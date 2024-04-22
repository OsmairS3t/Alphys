import React from 'react';
import { FlatList } from 'react-native';
import { Button } from '../../components/Forms/Button';
import { categories } from '../../../utils/database';
import { ICategory } from '../../../utils/interface';

import { 
  Container,
  Header,
  Title,
  Category,
  Icon,
  Name,
  Separator,
  Footer
 } from './styles';

// interface Category {
//   id: string;
//   name: string;
// }

interface ProductProps {
  category: ICategory;
  setCategory: (category: ICategory) => void;
  closeSelectCategory: () => void;
}

export function CategorySelect({
  category,
  setCategory,
  closeSelectCategory
}: ProductProps) {

  function handleCategorySelect(category: ICategory) {
    setCategory(category);
  }

  return (
    <Container>
      <Header>
        <Title>Categoria</Title>
      </Header>

      <FlatList 
        data={categories}
        style={{ flex: 1, width: '100%'}}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.id === item.id}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={Separator}
      />

      <Footer>
        <Button 
          title='Selecionar' 
          onPress={closeSelectCategory}  
        />
      </Footer>
    </Container>
  )
}
