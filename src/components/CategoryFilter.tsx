import React, { ReactElement } from 'react';
import {
  Pressable,
} from 'react-native';
import styled, { css } from 'styled-components/native';
import { useSelector, useDispatch } from 'react-redux';
import Line from './Line';
import { RootState } from '../features/store';
import { setCategory, CategoryColors } from '../features/homeCategoryFilters';

function CategoryFilter(): ReactElement {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.homeCategoryFilters);

  return (
    <Container>
      <Line />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {Object.values(CategoryColors).map((color) => (
          <CategoryItemWrapper
            key={color}
            onPress={() => dispatch(setCategory(color))}
          >
            <CategoryItem
              color={color}
              active={color === filters.category}
            >
              {color === 'default' && <CategoryItemLabel>ALL</CategoryItemLabel>}
            </CategoryItem>
          </CategoryItemWrapper>
        ))}
      </ScrollView>
    </Container>
  );
}

const Container = styled.View`
    flex: 1;
    margin-top: 32px;
`;

const ScrollView = styled.ScrollView`
    flex-direction: row;
    padding: 0 8px 8px 8px;
`;

const CategoryItemWrapper = styled(Pressable)`
    min-width: 48px;
    height: ${32 + 16 + 16}px;
    padding: 8px;
    align-items: center;
    justify-content: center;
`;

const CategoryItem = styled.View<{color: CategoryColors, active: boolean}>`
    min-width: 32px;
    height: 32px;
    border-radius: 8px;
    padding: 0 16px;
    align-items: center;
    flex-direction: row;
    opacity: 0.25;

    background-color: ${(props) => props.theme.colors.category[props.color]};

    ${(props) => props.active && css`opacity: 1;`}
`;

const CategoryItemLabel = styled.Text`
    font-size: 12px;
    color: rgba(0, 0, 0, .56);
`;

export default CategoryFilter;
