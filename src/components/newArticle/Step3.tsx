import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components/native';
import { TouchableOpacity, useWindowDimensions } from 'react-native';
import FormLabel from '../FormLabel';
import Actions from './Actions';
import { CategoryColors } from '../../features/homeCategoryFilters';
import useArticle from '../../features/article/useArticle';
import Button, { ButtonSize } from '../Button';

export interface Step3Props {
  nextStep: () => void;
}

function Step3({ nextStep }: Step3Props): ReactElement {
  const windowWidth = useWindowDimensions().width;
  const { articleDraft, setArticleDraft } = useArticle();
  const handleCategoryPress = (color: CategoryColors) => {
    setArticleDraft({
      ...articleDraft,
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
                active={color === articleDraft.categoryColor}
              />
            </CategoryItemWrapper>
          )))}
        </CategoryContainer>
      </Container>

      <Actions>
        <Button onPress={nextStep} label="다음" size={ButtonSize.Large} />
      </Actions>
    </>
  );
}

const Container = styled.View`
  justify-content: center;
  padding: 0 8px;
  flex: 1;
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
