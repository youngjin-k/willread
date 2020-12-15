import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLinkPreview } from 'link-preview-js';
import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import FormLabel from '../../components/FormLabel';
import TextInput from '../../components/TextInput';
import { RootStackParamList } from '../../config/Navigation';
import useArticle from '../../features/article/useArticle';
import VALID_URL from '../../lib/regex/validUrl';
import Actions from './Actions';
import Complete from './Complete';

function NewArticleScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { articleDraft, setArticleDraft, addArticle } = useArticle();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [complete, setComplete] = useState(false);
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
      addArticle({
        uri: articleDraft.uri,
        title: response.title,
        description: response.description,
        image: response.images.length > 0 ? response.images[0] : '',
        favicon: response.favicons.length > 0 ? response.favicons[0] : '',
      });
      setComplete(true);
    } catch (e) {
      setLoading(false);
    }
  }, [articleDraft, addArticle]);

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'space-between' }}
      >
        <Header>
          <HeaderTitle>새로운 윌리드</HeaderTitle>
          <CloseButtonWrapper>
            <Button
              onPress={() => navigation.pop()}
              variant={ButtonVariant.DefaultText}
              size={ButtonSize.Small}
            >
              <BackIcon name="x" />
            </Button>
          </CloseButtonWrapper>
        </Header>

        {complete ? (
          <Content>
            <Complete />
          </Content>
        ) : (

          <Content>
            <FormLabel>링크를 입력하세요</FormLabel>
            <TextInput
              defaultValue={route?.params?.uri}
              autoFocus
              keyboardType="url"
              onChangeText={handleTextChange}
            />

            <Actions>
              <Button
                onPress={handleOnPress}
                loading={loading}
                disabled={disabled}
                label="다음"
                size={ButtonSize.Large}
              />
            </Actions>
          </Content>
        )}
      </KeyboardAvoidingView>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Header = styled.View`
  height: 56px;
  padding: 0 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CloseButtonWrapper = styled.View`
  padding: 0 16px;
  height: 56px;
  width: ${32 + 32}px;
  position: absolute;
  top: 0;
  right: 0;
  justify-content: center;
`;

const BackIcon = styled(Icon)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.title};
`;

const HeaderTitle = styled(Text)`
  font-size: 18px;
  color: ${(props) => props.theme.colors.typography.title};
  font-weight: bold;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 16px 72px 16px;
`;

export default NewArticleScreen;
