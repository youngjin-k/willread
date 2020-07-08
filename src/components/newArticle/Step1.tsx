import React, { ReactElement, useState, useCallback } from 'react';
import styled from 'styled-components/native';
import { getLinkPreview } from 'link-preview-js';
import FormLabel from '../FormLabel';
import TextInput from '../TextInput';
import Actions from './Actions';
import Button from './Button';
import { ArticleDraft } from '../../features/articles';

export interface Step1Props {
    article: ArticleDraft;
    setArticle: (article: ArticleDraft) => void;
    nextStep: () => void;
}

function Step1({
  article,
  setArticle,
  nextStep: next,
}: Step1Props): ReactElement {
  const [loading, setLoading] = useState(false);

  const handleTextChange = (uri: string) => {
    setArticle({
      ...article,
      uri,
    });
  };

  const handleOnPress = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getLinkPreview(article.uri);
      setArticle({
        ...article,
        title: response.title,
        description: response.description,
        imageUri: response.images[0],
      });
      next();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [next, article, setArticle]);

  return (
    <>
      <Container>
        <FormLabel>링크를 입력하세요</FormLabel>
        <TextInput
          defaultValue={article.uri}
          onChangeText={handleTextChange}
        />
      </Container>

      <Actions>
        <Button onPress={handleOnPress} loading={loading}>다음</Button>
      </Actions>
    </>
  );
}

const Container = styled.View`
  justify-content: center;
  padding: 16px;
`;

export default Step1;
