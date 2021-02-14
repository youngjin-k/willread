import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
} from 'react-native';
import styled from 'styled-components/native';
import * as MailComposer from 'expo-mail-composer';
import ScreenHeader, { ScreenHeaderTitle } from '../../components/ScreenHeader';

import { MenuStackParamList } from '../../config/Navigation/Menu';
import webBrowser from '../../lib/utils/webBrowser';
import MenuItem from './MenuItem';
import MenuList from './MenuList';

function MenuScreen() {
  const navigation = useNavigation<StackNavigationProp<MenuStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useScrollToTop(scrollViewRef);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsScrolled(event.nativeEvent.contentOffset.y > 0);
  };

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
    MailComposer.composeAsync({
      recipients: ['willreadteam@gmail.com'],
    });
  };

  return (
    <Container>
      <ScreenHeader isScrolled={isScrolled}>
        <ScreenHeaderTitle style={{ marginLeft: 16 }}>더보기</ScreenHeaderTitle>
      </ScreenHeader>
      <MenuScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <MenuList>
          <MenuItem
            title="새로운 소식"
            menuIconName="bell"
            onPress={openBlog}
          />
          <MenuItem
            title="의견 보내기"
            menuIconName="mail"
            onPress={composeMail}
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
            value="1.0.0"
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
