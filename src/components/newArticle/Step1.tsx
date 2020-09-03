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
import VALID_URL from '../../lib/regex/validUrl';
import useArticle from '../../features/article/useArticle';

export interface Step1Props {
    nextStep: () => void;
}

function Step1({ nextStep: next }: Step1Props): ReactElement {
  const { articleDraft, setArticleDraft } = useArticle();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(!VALID_URL.test(articleDraft.uri));
  }, [articleDraft]);

  const handleTextChange = (uri: string) => {
    setArticleDraft({
      ...articleDraft,
      uri,
    });
  };

  const handleOnPress = useCallback(async () => {
    setLoading(true);

    try {
      const response = await getLinkPreview(articleDraft.uri) as any;
      setArticleDraft({
        ...articleDraft,
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
  }, [next, articleDraft, setArticleDraft]);

  return (
    <>
      <Container>
        <FormLabel>링크를 입력하세요</FormLabel>
        <TextInput
          defaultValue={articleDraft.uri}
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
  padding: 0 16px;
  flex: 1;
`;

export default Step1;
