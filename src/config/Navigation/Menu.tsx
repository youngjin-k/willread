/* eslint-disable react/display-name */
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import themes from '../../lib/styles/themes';
import MenuScreen from '../../screens/MenuScreen';
import LanguageScreen from '../../screens/MenuScreen/LanguageScreen';
import ThemeScreen from '../../screens/MenuScreen/ThemeScreen';

const styles = {
  light: StyleSheet.create({
    headerTitle: {
      color: themes.light.colors.typography.primary,
      fontSize: 18,
    },
  }),
  dark: StyleSheet.create({
    headerTitle: {
      color: themes.dark.colors.typography.primary,
      fontSize: 18,
    },
  }),
};

interface HeaderBackButtonProps {
  onPress?: () => void;
}

function HeaderBackButton({ onPress }: HeaderBackButtonProps) {
  return (
    <HeaderBackButtonBlock>
      <Button
        onPress={onPress}
        variant={ButtonVariant.DefaultText}
        size={ButtonSize.Small}
      >
        <BackButtonIcon name="chevron-left" />
      </Button>
    </HeaderBackButtonBlock>
  );
}

export type MenuStackParamList = {
  MenuScreen: undefined;
  ThemeScreen: undefined;
  LanguageScreen: undefined;
};

const MenuStack = createStackNavigator<MenuStackParamList>();

function Menu() {
  const scheme = useColorScheme();
  const appearance = scheme === 'dark' ? 'dark' : 'light';
  return (
    <MenuStack.Navigator>
      <MenuStack.Screen
        name="MenuScreen"
        component={MenuScreen}
        options={{
          headerShown: false,
          title: '더보기',
        }}
      />
      <MenuStack.Screen
        name="ThemeScreen"
        component={ThemeScreen}
        options={{
          title: '화면',
          headerBackTitleVisible: false,
          headerLeft: ({ onPress }) => <HeaderBackButton onPress={onPress} />,
          headerTitleAlign: 'center',
          headerBackground: () => <HeaderBackground />,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerTitleStyle: styles[appearance].headerTitle,
        }}
      />
      <MenuStack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{
          title: '언어',
          headerBackTitleVisible: false,
          headerLeft: ({ onPress }) => <HeaderBackButton onPress={onPress} />,
          headerTitleAlign: 'center',
          headerBackground: () => <HeaderBackground />,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          headerTitleStyle: styles[appearance].headerTitle,
        }}
      />
    </MenuStack.Navigator>
  );
}

const HeaderBackButtonBlock = styled.View`
  padding: 0 16px;
  height: 56px;
  width: 64px;
  justify-content: center;
`;

const BackButtonIcon = styled(Icon)`
  font-size: 24px;
  color: ${(props) => props.theme.colors.typography.primary};
`;

const HeaderBackground = styled.View`
  background-color: ${(props) => props.theme.colors.background};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export default Menu;
