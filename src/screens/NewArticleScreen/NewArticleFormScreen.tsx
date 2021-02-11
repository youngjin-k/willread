import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import fetch from 'cross-fetch';
import { getPreviewFromContent } from 'link-preview-js';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput as NativeTextInput,
  View,
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

import Alert from '../../components/Alert';
import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import FormLabel from '../../components/FormLabel';
import TextInput from '../../components/TextInput';
import { RootStackParamList } from '../../config/Navigation';
import useArticle from '../../features/article/useArticle';
import VALID_URL from '../../lib/regex/validUrl';
import themes from '../../lib/styles/themes';
import haptics from '../../lib/utils/haptics';

export interface PreviewHTML {
  url: string;
  title: string;
  siteName: string;
  description: string;
  mediaType: string;
  contentType: string | undefined;
  images: string[];
  videos: {
    url: string;
    secureUrl: string;
    type: string;
    width: string;
    height: string;
  }[];
  favicons: string[];
}

type ThenArgRecursive<T> = T extends PromiseLike<infer U>
  ? ThenArgRecursive<U>
  : T;

function isTextHtmlType(
  response: ThenArgRecursive<ReturnType<typeof getPreviewFromContent>>,
): response is PreviewHTML {
  return response.contentType?.includes('text/html') === true;
}

function NewArticleFormScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { addArticle } = useArticle();
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const route = useRoute<RouteProp<RootStackParamList, 'NewArticle'>>();
  const [link, setLink] = useState('');
  const scheme = useColorScheme();
  const [useExpandedLinkInput, setUseExpandedLinkInput] = useState(false);
  const linkInputRef = useRef<NativeTextInput>(null);
  const linkExpandInputRef = useRef<NativeTextInput>(null);
  const [errorMessage, setErrorMessage] = useState<{
    title: string;
    message: string;
  } | null>();
  const [visibleErrorAlert, setVisibleErrorAlert] = useState(false);

  useEffect(() => {
    if (route?.params?.url) {
      setLink(route.params.url);
    }
  }, [route]);

  useEffect(() => {
    setDisabled(!VALID_URL.test(link));
  }, [link]);

  const handleChangeLink = (url: string) => {
    setLink(url);
  };

  const setFocus = useCallback(() => {
    if (useExpandedLinkInput) {
      setFocusExpandLinkInput();
      return;
    }

    setFocusLinkInput();
  }, [useExpandedLinkInput]);

  const setFocusLinkInput = () => {
    setTimeout(
      () => {
        if (linkInputRef.current) {
          linkInputRef.current.focus();
        }
      },
      Platform.OS === 'ios' ? 160 : 0,
    );
  };

  const setFocusExpandLinkInput = () => {
    setTimeout(
      () => {
        if (linkExpandInputRef.current) {
          linkExpandInputRef.current.focus();
        }
      },
      Platform.OS === 'ios' ? 160 : 0,
    );
  };

  useEffect(() => {
    setFocusLinkInput();
  }, []);

  const handleExpandButtonClick = () => {
    setUseExpandedLinkInput(true);
    setFocusExpandLinkInput();
  };

  const handleContractButtonClick = () => {
    setUseExpandedLinkInput(false);
    setFocusLinkInput();
  };

  const showErrorAlert = (title: string, message: string) => {
    setErrorMessage({
      title,
      message,
    });
    setVisibleErrorAlert(true);
  };

  const hideErrorAlert = () => {
    setVisibleErrorAlert(false);
    setErrorMessage(null);
    setTimeout(() => {
      setFocus();
    }, 400);
  };

  const handleOnPress = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch(link, {
        redirect: 'follow',
      });

      if (response.status > 400) {
        showErrorAlert(
          '정보를 가져올 수 없어요.',
          '확인 후 다시 시도해주세요.',
        );
        setLoading(false);
        return;
      }

      const headers: Record<string, string> = {};
      response.headers.forEach((header: string, key: string) => {
        headers[key] = header;
      });

      const html = await response.text();

      let article = {
        url: link,
        title: link,
        description: '',
        image: '',
        favicon: '',
      };

      if (html) {
        const content = await getPreviewFromContent({
          data: html,
          headers,
          url: link,
        });

        if (!isTextHtmlType(content)) {
          showErrorAlert(
            '등록할 수 없는 유형의 링크에요.',
            '텍스트 형태의 콘텐츠만 등록할 수 있어요.',
          );
          setLoading(false);
          return;
        }

        article = {
          url: link,
          title: content.title ? content.title : link,
          description: content.description,
          image: content.images.length > 0 ? content.images[0] : '',
          favicon: content.favicons.length > 0 ? content.favicons[0] : '',
        };
      }

      const addedAt = addArticle(article);

      haptics.notification();

      if (addedAt === 'articleList') {
        navigation.replace('SuccessSaveArticle');
        return;
      }

      navigation.replace('SuccessSavePendingList');
    } catch (e) {
      showErrorAlert('정보를 가져올 수 없어요.', '확인 후 다시 시도해주세요.');
      setLoading(false);
    }
  }, [link, addArticle, navigation]);

  const handleModalClosePress = () => {
    Keyboard.dismiss();
    navigation.pop();
  };

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
              onPress={handleModalClosePress}
              variant={ButtonVariant.DefaultText}
              size={ButtonSize.Small}
            >
              <BackIcon name="x" />
            </Button>
          </CloseButtonWrapper>
        </Header>

        <Content>
          {useExpandedLinkInput ? (
            <>
              <ContractButtonWrapper>
                <Button
                  onPress={handleContractButtonClick}
                  size={ButtonSize.Small}
                  variant={ButtonVariant.PrimaryText}
                  style={{ paddingHorizontal: 8 }}
                >
                  <MaximizeIcon name="minimize-2" />
                </Button>
              </ContractButtonWrapper>
              <LinkInput
                ref={linkExpandInputRef}
                placeholder="링크를 입력하세요"
                placeholderTextColor={
                  themes[scheme === 'dark' ? 'dark' : 'light'].colors.typography
                    .secondary
                }
                keyboardType="url"
                onChangeText={handleChangeLink}
                defaultValue={link}
                value={link}
                multiline
                textAlignVertical="top"
                editable={!loading}
              />
            </>
          ) : (
            <>
              <View>
                <FormLabel>링크를 입력하세요</FormLabel>
              </View>
              <TextInputWrapper>
                <TextInput
                  ref={linkInputRef}
                  keyboardType="url"
                  defaultValue={link}
                  value={link}
                  onChangeText={handleChangeLink}
                  style={{ paddingRight: 60 }}
                  editable={!loading}
                />
                <ExpandButtonWrapper>
                  <Button
                    onPress={handleExpandButtonClick}
                    size={ButtonSize.Medium}
                    variant={ButtonVariant.PrimaryText}
                    style={{ paddingHorizontal: 16 }}
                  >
                    <MaximizeIcon name="maximize-2" />
                  </Button>
                </ExpandButtonWrapper>
              </TextInputWrapper>
            </>
          )}

          <Actions>
            <Button
              onPress={handleOnPress}
              loading={loading}
              disabled={disabled}
              label="등록"
              size={ButtonSize.Large}
            />
          </Actions>
        </Content>
      </KeyboardAvoidingView>

      <Alert
        visible={visibleErrorAlert}
        title={errorMessage?.title}
        message={errorMessage?.message}
        onClose={hideErrorAlert}
        buttons={[
          {
            text: '확인',
            style: 'default',
            onPress: hideErrorAlert,
          },
        ]}
      />
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
  color: ${(props) => props.theme.colors.typography.primary};
`;

const HeaderTitle = styled(Text)`
  font-size: 18px;
  color: ${(props) => props.theme.colors.typography.primary};
  font-weight: bold;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 16px 72px 16px;
`;

const TextInputWrapper = styled.View``;

const LinkInput = styled.TextInput`
  flex: 1;
  font-size: 18px;
  color: ${(props) => props.theme.colors.typography.primary};
  padding: 0;
`;

const ExpandButtonWrapper = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  align-items: flex-end;
  padding: 4px;
`;

const ContractButtonWrapper = styled.View`
  align-items: flex-end;
`;

const MaximizeIcon = styled(Icon)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.point};
`;

const Actions = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  height: ${64 + 16 + 16}px;
`;

export default NewArticleFormScreen;
