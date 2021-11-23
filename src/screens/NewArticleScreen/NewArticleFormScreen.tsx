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
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

import Alert from '../../components/Alert';
import BottomCtaContainer from '../../components/BottomCtaContainer';
import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import FormLabel from '../../components/FormLabel';
import TextInput from '../../components/TextInput';
import { RootStackParamList } from '../../config/Navigation';
import useArticle from '../../features/article/useArticle';
import useNotificationPermission, { PermissionStatus } from '../../lib/hooks/useNotificationPermission';
import VALID_URL from '../../lib/regex/validUrl';
import themes from '../../lib/styles/themes';
import haptics from '../../lib/utils/haptics';
import { getPreference, setPreference } from '../../lib/utils/preferences';
import willreadToast from '../../lib/willreadToast';

const openSettings = () => {
  Linking.openSettings();
};

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
  const { permissionStatusRef, requestPermissions } = useNotificationPermission();
  const [visibleNotificationAlert, setVisibleNotificationAlert] = useState(false);
  const [
    visibleNotificationPermissionAlert,
    setVisibleNotificationPermissionAlert,
  ] = useState(false);

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

  const setFocus = useCallback((delay: number = 0) => {
    if (useExpandedLinkInput) {
      setFocusExpandLinkInput(delay);
      return;
    }

    setFocusLinkInput(delay);
  }, [useExpandedLinkInput]);

  const setFocusLinkInput = (delay: number = 0) => {
    setTimeout(
      () => {
        if (linkInputRef.current) {
          linkInputRef.current.focus();
        }
      },
      delay,
    );
  };

  const setFocusExpandLinkInput = (delay: number = 0) => {
    setTimeout(
      () => {
        if (linkExpandInputRef.current) {
          linkExpandInputRef.current.focus();
        }
      },
      delay,
    );
  };

  useEffect(() => {
    setFocusLinkInput(Platform.OS === 'ios' ? 160 : 0);
  }, []);

  const handleExpandButtonClick = () => {
    setUseExpandedLinkInput(true);
    setFocusExpandLinkInput(Platform.OS === 'ios' ? 160 : 0);
  };

  const handleContractButtonClick = () => {
    setUseExpandedLinkInput(false);
    setFocusLinkInput(Platform.OS === 'ios' ? 160 : 0);
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
    setFocus(400);
  };

  const handleOnPress = useCallback(async () => {
    setLoading(true);

    try {
      const allowExpireNotification = await getPreference('allowExpireNotification');
      if (allowExpireNotification === 'true') {
        if (permissionStatusRef.current === PermissionStatus.UNDETERMINED) {
          setVisibleNotificationAlert(true);
          return;
        }

        if (permissionStatusRef.current === PermissionStatus.DENIED) {
          setVisibleNotificationPermissionAlert(true);
          return;
        }
      }

      const response = await fetch(link, {
        redirect: 'follow',
        headers: {
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
        },
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

      addArticle(article);

      haptics.notification();

      navigation.replace('SuccessSaveArticle');
    } catch (e) {
      showErrorAlert('정보를 가져올 수 없어요.', '확인 후 다시 시도해주세요.');
      setLoading(false);
    }
  }, [link, addArticle, navigation, permissionStatusRef]);

  const handleDeninedExpireNotificationPress = () => {
    setVisibleNotificationAlert(false);
    setVisibleNotificationPermissionAlert(false);

    setPreference('allowExpireNotification', 'false');

    willreadToast.showSimple(
      '설정은 더보기 메뉴에서 나중에 다시 변경할 수 있어요.',
    );

    handleOnPress();
  };

  const handleAcceptExpiredNotificationPress = async () => {
    setVisibleNotificationAlert(false);
    const status = await requestPermissions();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // status의 type은 PermissionStatus 이지만 실제 값은 0/1이 반환 됨
    if (status === PermissionStatus.DENIED || status === 0) {
      return;
    }

    setTimeout(() => {
      handleOnPress();
    }, 300);
  };

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
                autoCapitalize="none"
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
                  autoCapitalize="none"
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

          <BottomCtaContainer fixed>
            <Button
              onPress={handleOnPress}
              loading={loading}
              disabled={disabled}
              label="등록"
              size={ButtonSize.Large}
            />
          </BottomCtaContainer>
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

      <Alert
        visible={visibleNotificationAlert}
        title="알려드려요."
        message={(
          <>
            <NotificationAlertText>
              윌리드에 등록한 아티클은 7일이 경과되면 자동으로 삭제되며, 남은 시간이 24시간 미만일 때 보관 기간을 연장할 수 있어요.
            </NotificationAlertText>
            <NotificationAlertText>
              잊지 않도록 알림을 보내드릴게요.
            </NotificationAlertText>
          </>
        )}
        onClose={() => {
          setVisibleNotificationAlert(false);
          setLoading(false);
        }}
        buttons={[
          {
            text: '안 받을래요',
            style: 'cancel',
            onPress: handleDeninedExpireNotificationPress,
          },
          {
            text: '좋아요',
            style: 'default',
            onPress: handleAcceptExpiredNotificationPress,
          },
        ]}
      />

      <Alert
        visible={visibleNotificationPermissionAlert}
        title="알림 권한이 필요해요."
        message="자동 삭제 하루 전 알림을 보내드리기 위해 알림 권한이 필요해요. 시스템 설정에서 알림 권한을 허용해주세요."
        onClose={() => {
          setVisibleNotificationPermissionAlert(false);
          setLoading(false);
        }}
        buttons={[
          {
            text: '안 받을래요',
            style: 'cancel',
            onPress: handleDeninedExpireNotificationPress,
          },
          {
            text: '설정으로 이동',
            style: 'default',
            onPress: () => {
              setVisibleNotificationPermissionAlert(false);
              setLoading(false);
              openSettings();
            },
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

const NotificationAlertText = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.colors.typography.primary};
  margin-bottom: 8px;
`;

export default NewArticleFormScreen;
