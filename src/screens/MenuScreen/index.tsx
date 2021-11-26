import { useIsFocused, useNavigation, useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import {
  useLayoutEffect, useRef, useState,
} from 'react';
import {
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import styled from 'styled-components/native';
import * as MailComposer from 'expo-mail-composer';

import { MenuStackParamList } from '../../config/Navigation/Menu';
import webBrowser from '../../lib/utils/webBrowser';
import MenuItem from './MenuItem';
import MenuList from './MenuList';
import { defaultValues, getPreference, setPreference } from '../../lib/utils/preferences';
import useTheme from '../../lib/styles/useTheme';
import willreadToast from '../../lib/willreadToast';

function MenuScreen() {
  const navigation = useNavigation<StackNavigationProp<MenuStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [allowExpireNotification, setAllowExpireNotification] = useState(
    defaultValues.allowExpireNotification,
  );
  const theme = useTheme();
  const isFocused = useIsFocused();

  useLayoutEffect(() => {
    const fetch = async () => {
      const value = await getPreference('allowExpireNotification');
      setAllowExpireNotification(value);
    };
    fetch();
  }, [isFocused]);

  useScrollToTop(scrollViewRef);

  const openBlog = () => {
    let blogUrl = 'https://www.willread.app/blog';

    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      blogUrl = `https://www.willread.app/webview/blog/${Platform.OS}`;
    }

    webBrowser.open(blogUrl);
  };

  const openPrivacyPolicy = () => {
    webBrowser.open('https://www.willread.app/policy/privacy?webview=true');
  };

  const composeMail = () => {
    // TODO: google form 으로 변경
    MailComposer.composeAsync({
      recipients: ['willreadteam@gmail.com'],
    });
  };

  const updateAllowExpireNotification = async (value: boolean) => {
    await setPreference('allowExpireNotification', value ? 'true' : 'false');
    setAllowExpireNotification(value ? 'true' : 'false');
    if (value) {
      willreadToast.showSimple('지금부터 등록하는 아티클은 삭제 하루 전 알려드릴게요.');
    } else {
      willreadToast.showSimple('지금부터 등록하는 아티클은 알림을 받지않아요.');
    }
  };

  return (
    <Container>
      <MenuScrollView showsVerticalScrollIndicator={false}>
        <MenuList>
          <MenuItem
            title="새로운 소식"
            menuIconName="info"
            onPress={openBlog}
          />
          <MenuItem
            title="의견 보내기"
            menuIconName="mail"
            onPress={composeMail}
          />
        </MenuList>

        <MenuList title="설정">
          <MenuItem
            title="자동 삭제 전 알림"
            menuIconName="bell"
            right={(
              <Switch
                trackColor={
                  Platform.OS === 'android'
                    ? {
                      true: theme.colors.primary,
                      false: theme.colors.inputBackground,
                    }
                    : {
                      true: theme.colors.primary,
                    }
                }
                thumbColor={
                  Platform.OS === 'android' ? theme.colors.background : undefined
                }
                value={allowExpireNotification === 'true'}
                onValueChange={(value) => {
                  updateAllowExpireNotification(value);
                }}
              />
            )}
          />
        </MenuList>

        <MenuList title="기타">
          <MenuItem
            title="개인정보 처리 방침"
            menuIconName="lock"
            onPress={openPrivacyPolicy}
          />
          <MenuItem
            title="버전"
            menuIconName="flag"
            value="1.0.1"
          />
          {__DEV__ && (
            <MenuItem
              title="DEVELOPER"
              menuIconName="code"
              onPress={() => navigation.navigate('DeveloperScreen')}
              hasSubMenu
            />
          )}
        </MenuList>
      </MenuScrollView>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const MenuScrollView = styled.ScrollView``;

export default MenuScreen;
