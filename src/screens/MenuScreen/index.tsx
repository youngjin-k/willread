import { useNavigation, useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { useRef } from 'react';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';

import { MenuStackParamList } from '../../config/Navigation/Menu';
import MenuItem from './MenuItem';
import MenuList from './MenuList';

function MenuScreen() {
  const navigation = useNavigation<StackNavigationProp<MenuStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);

  useScrollToTop(scrollViewRef);

  return (
    <Container>
      <MenuScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
      >
        <Header>
          <HeaderTitle>더보기</HeaderTitle>
        </Header>
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
        </MenuList>
      </MenuScrollView>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const MenuScrollView = styled.ScrollView``;

const Header = styled.View`
  padding: 32px 16px 16px 16px;
  flex-direction: row;
  align-items: center;
`;

const HeaderTitle = styled.Text`
  font-weight: bold;
  font-size: 28px;
  color: ${(props) => props.theme.colors.typography.primary};
`;

export default MenuScreen;
