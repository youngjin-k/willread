import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components/native';
import { TouchableOpacity, useWindowDimensions } from 'react-native';
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
  const windowWidth = useWindowDimensions().width;
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

          {Object.values(CategoryColors).map((color) => (color === CategoryColors.DEFAULT ? null : (
            <CategoryItemWrapper
              key={color}
              onPress={() => handleCategoryPress(color)}
              windowWidth={windowWidth}
            >
              <CategoryItem
                color={color}
                active={color === article.categoryColor}
              />
            </CategoryItemWrapper>
          )))}
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
  padding: 0 8px;
`;

const CategoryContainer = styled.View`
  flex-direction: row;
`;

const CategoryItemWrapper = styled(TouchableOpacity)<{windowWidth: number}>`
  width: ${(props) => (props.windowWidth - 16) / 6}px;
  height: ${(props) => (props.windowWidth - 16) / 6}px;
  padding: 8px;
  align-items: center;
  justify-content: center;
`;

const CategoryItem = styled.View<{color: CategoryColors, active: boolean}>`
  border-radius: 8px;
  padding: 0 16px;
  align-items: center;
  flex-direction: row;
  opacity: 0.25;
  width: 100%;
  height: 100%;

  background-color: ${(props) => props.theme.colors.category[props.color]};

  ${(props) => props.active && css`opacity: 1;`}
`;

export default Step3;
