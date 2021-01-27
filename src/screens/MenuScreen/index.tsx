import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import ScreenHeader, { ScreenHeaderTitle } from '../../components/ScreenHeader';

import { MenuStackParamList } from '../../config/Navigation/Menu';
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
            title="자주 묻는 질문"
            menuIconName="help-circle"
          />
          <MenuItem
            title="공지사항"
            menuIconName="info"
          />
          <MenuItem
            title="의견 보내기"
            menuIconName="mail"
          />
        </MenuList>

        <MenuList title="설정">
          <MenuItem
            title="화면"
            menuIconName="sun"
            value="시스템 설정에 맞춤"
            hasSubMenu
            onPress={() => navigation.navigate('ThemeScreen')}
          />
          <MenuItem
            title="언어"
            menuIconName="globe"
            value="한국어"
            hasSubMenu
            onPress={() => navigation.navigate('LanguageScreen')}
          />
        </MenuList>

        <MenuList title="기타">
          <MenuItem
            title="개인정보 처리 방침"
            menuIconName="lock"
            hasSubMenu
          />
          <MenuItem
            title="오픈소스 라이선스"
            menuIconName="book-open"
            hasSubMenu
          />
          <MenuItem
            title="버전"
            menuIconName="code"
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
