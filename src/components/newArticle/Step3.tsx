import React, { ReactElement, useState, useCallback } from 'react';
import styled from 'styled-components/native';
import FormLabel from '../FormLabel';
import Actions from './Actions';
import { CategoryColors } from '../../features/homeCategoryFilters';
import useArticle from '../../features/article/useArticle';
import Button, { ButtonSize } from '../Button';
import CategoryPicker from '../CategoryPicker';

export interface Step3Props {
  nextStep: () => void;
}

function Step3({ nextStep }: Step3Props): ReactElement {
  const { articleDraft, setArticleDraft, addArticle } = useArticle();
  const [loading, setLoading] = useState(false);
  const handleCategoryPress = (color: CategoryColors) => {
    setArticleDraft({
      ...articleDraft,
      categoryColor: color,
    });
  };

  const save = useCallback(() => {
    addArticle(articleDraft);
  }, [addArticle, articleDraft]);

  const handleOnPress = () => {
    setLoading(true);
    save();
    nextStep();
  };

  return (
    <>
      <Container>
        <FormLabel>태그를 선택하세요</FormLabel>
        <CategoryContainer>
          <CategoryPicker
            value={articleDraft.categoryColor}
            onChange={handleCategoryPress}
          />
        </CategoryContainer>
      </Container>

      <Actions>
        <Button
          onPress={handleOnPress}
          label="다음"
          size={ButtonSize.Large}
          loading={loading}
        />
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

export default Step3;
