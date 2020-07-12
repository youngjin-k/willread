import React, {
  ReactElement, useState, useCallback, useEffect,
} from 'react';
import styled from 'styled-components/native';
import { getLinkPreview } from 'link-preview-js';
import axios from 'axios';
import Readability from 'readability';
import FormLabel from '../FormLabel';
import TextInput from '../TextInput';
import Actions from './Actions';
import Button from './Button';
import { ArticleDraft } from '../../features/articles';
import VALID_URL from '../../lib/regex/validUrl';

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
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(!VALID_URL.test(article.uri));
  }, [article]);

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
        image: response.images.length > 0 ? response.images[0] : '',
        favicon: response.favicons.length > 0 ? response.favicons[0] : '',
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
        <Button onPress={handleOnPress} loading={loading} disabled={disabled}>다음</Button>
      </Actions>
    </>
  );
}

const Container = styled.View`
  justify-content: center;
  padding: 16px;
`;

export default Step1;
