import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import FormLabel from '../FormLabel';
import Actions from './Actions';
import Button from './Button';
import { CategoryColors } from '../../features/homeCategoryFilters';
import { ArticleDraft } from '../../features/articles';

export interface Step3Props {
  article: ArticleDraft;
  setArticle: (article: ArticleDraft) => void;
  nextStep: () => void;
}

function Step3({
  article,
  setArticle,
  nextStep,
}: Step3Props): ReactElement {
  const handleCategoryPress = (color: CategoryColors) => {
    setArticle({
      ...article,
      categoryColor: color,
    });
  };

  return (
    <>
      <Container>
        <FormLabel>태그를 선택하세요</FormLabel>
        <CategoryContainer>

          {Object.values(CategoryColors).map((color) => (
            <CategoryItemWrapper
              key={color}
              onPress={() => handleCategoryPress(color)}
            >
              <CategoryItem
                color={color}
                active={color === article.categoryColor}
              />
            </CategoryItemWrapper>
          ))}
        </CategoryContainer>
      </Container>

      <Actions>
        <Button onPress={nextStep}>다음</Button>
      </Actions>
    </>
  );
}

const Container = styled.View`
  justify-content: center;
  padding: 0 16px;
`;

const CategoryContainer = styled.View`
  flex-direction: row;
`;

const CategoryItemWrapper = styled(TouchableOpacity)`
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

export default Step3;
