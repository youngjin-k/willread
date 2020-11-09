import { RouteProp, useRoute } from '@react-navigation/native';
import { getLinkPreview } from 'link-preview-js';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import styled from 'styled-components/native';

import Button, { ButtonSize } from '../../components/Button';
import FormLabel from '../../components/FormLabel';
import TextInput from '../../components/TextInput';
import { RootStackParamList } from '../../config/Navigation';
import useArticle from '../../features/article/useArticle';
import VALID_URL from '../../lib/regex/validUrl';
import Actions from './Actions';

export interface Step1Props {
  nextStep: () => void;
}

function Step1({ nextStep: next }: Step1Props): ReactElement {
  const { articleDraft, setArticleDraft } = useArticle();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const route = useRoute<RouteProp<RootStackParamList, 'NewArticle'>>();

  useEffect(() => {
    if (route?.params?.uri) {
      setArticleDraft({
        ...articleDraft,
        uri: route.params.uri,
      });
    }
  }, [route]);

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
      const response = (await getLinkPreview(articleDraft.uri)) as any;
      setArticleDraft({
        ...articleDraft,
        title: response.title,
        description: response.description,
        image: response.images.length > 0 ? response.images[0] : '',
        favicon: response.favicons.length > 0 ? response.favicons[0] : '',
      });
      next();
    } catch (e) {
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
        <Button
          onPress={handleOnPress}
          loading={loading}
          disabled={disabled}
          label="다음"
          size={ButtonSize.Large}
        />
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
