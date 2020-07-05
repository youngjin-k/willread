import React, { ReactElement } from 'react';
import styled from 'styled-components/native';
import { CategoryColors } from './CategoryFilter';

export interface CategoryBarProps {
    categoryColor: CategoryColors;
}

function CategoryBar({ categoryColor }: CategoryBarProps): ReactElement {
  if (categoryColor === CategoryColors.DEFAULT) {
    return null;
  }
  return (
    <CategoryBarBlock>
      <Bar color={categoryColor} />
    </CategoryBarBlock>
  );
}

const CategoryBarBlock = styled.View`
    margin: 0 0 8px 0;
`;

const Bar = styled.View<{color: CategoryColors}>`
    width: 16px;
    height: 4px;
    border-radius: 2px;
    background-color: ${(props) => props.theme.colors.category[props.color]};
`;

export default CategoryBar;
