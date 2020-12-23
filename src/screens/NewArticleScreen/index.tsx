import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getLinkPreview } from 'link-preview-js';
import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Text, useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import FormLabel from '../../components/FormLabel';
import TextInput from '../../components/TextInput';
import { RootStackParamList } from '../../config/Navigation';
import useArticle from '../../features/article/useArticle';
import VALID_URL from '../../lib/regex/validUrl';
import themes from '../../lib/styles/themes';
import Actions from './Actions';
import Complete from './Complete';

function NewArticleScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { addArticle } = useArticle();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [complete, setComplete] = useState(false);
  const route = useRoute<RouteProp<RootStackParamList, 'NewArticle'>>();
  const [link, setLink] = useState('');
  const scheme = useColorScheme();
  const [useExpandedLinkInput, setUseExpandedLinkInput] = useState(false);

  useEffect(() => {
    if (route?.params?.uri) {
      setLink(route.params.uri);
    }
  }, [route]);

  useEffect(() => {
    setDisabled(!VALID_URL.test(link));
  }, [link]);

  const handleChangeLink = (uri: string) => {
    setLink(uri);
  };

  const handleExpandButtonClick = () => {
    setUseExpandedLinkInput(true);
  };

  const handleOnPress = useCallback(async () => {
    setLoading(true);

    try {
      const response = (await getLinkPreview(link)) as any;
      addArticle({
        uri: link,
        title: response.title,
        description: response.description,
        image: response.images.length > 0 ? response.images[0] : '',
        favicon: response.favicons.length > 0 ? response.favicons[0] : '',
      });
      setComplete(true);
    } catch (e) {
      setLoading(false);
    }
  }, [link, addArticle]);

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
            {useExpandedLinkInput ? (
              <LinkInput
                placeholder="링크를 입력하세요"
                placeholderTextColor={
                  themes[scheme === 'dark' ? 'dark' : 'light'].colors.typography
                    .secondary
                }
                autoFocus
                keyboardType="url"
                onChangeText={handleChangeLink}
                defaultValue={link}
                value={link}
                multiline
                textAlignVertical="top"
              />
            ) : (
              <>
                <FormLabel>링크를 입력하세요</FormLabel>
                <TextInput
                  autoFocus
                  keyboardType="url"
                  onChangeText={handleChangeLink}
                />
                <ExpandButtonWrapper>
                  <Button
                    onPress={handleExpandButtonClick}
                    size={ButtonSize.Small}
                    variant={ButtonVariant.PrimaryTenderContained}
                    style={{ paddingHorizontal: 8 }}
                  >
                    <MaximizeIcon name="maximize-2" />
                  </Button>
                </ExpandButtonWrapper>
              </>
            )}

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

const LinkInput = styled.TextInput`
  flex: 1;
  font-size: 18px;
  color: ${(props) => props.theme.colors.typography.title};
  padding: 0;
`;

const ExpandButtonWrapper = styled.View`
  align-items: flex-end;
  padding: 12px 0;
`;

const MaximizeIcon = styled(Icon)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.primary};
`;

export default NewArticleScreen;
