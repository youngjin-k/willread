/* eslint-disable react/display-name */
import Icon from 'react-native-vector-icons/Feather';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';

import themes from '../../src/lib/styles/themes';
import MyScreen from '../../src/screens/MyScreen';
import { Article } from '../features/article/articles';
import HomeScreen from '../screens/HomeScreen';
import NewArticleScreen from '../screens/NewArticleScreen';
import NewNotificationScreen from '../screens/NewNotificationScreen';
import SuccessSaveArticleScreen from '../screens/SuccessSaveArticleScreen';

export type TabParamList = {
  Home: {
    setScrollBottom?: boolean;
  };
  Add: undefined;
  More: undefined;
};
const Tab = createBottomTabNavigator<TabParamList>();

const willreadLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: themes.light.colors.typography.title,
    background: themes.light.colors.background,
    card: themes.light.colors.background,
    text: themes.light.colors.typography.secondary,
  },
};

const willreadDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: themes.dark.colors.typography.title,
    background: themes.dark.colors.background,
    card: themes.dark.colors.secondary,
    text: themes.dark.colors.typography.secondary,
  },
};

const NewArticleScreenPlaceholder = () => null;

function AppTabsScreen() {
  const scheme = useColorScheme();

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="home"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={NewArticleScreenPlaceholder}
        options={{
          tabBarLabel: '추가',
          tabBarIcon: ({ size }) => (
            <View
              style={{
                width: size,
                height: size,
                backgroundColor:
                  themes[scheme === 'dark' ? 'dark' : 'light'].colors.primary,
                borderRadius: 6,
              }}
            >
              <Icon
                name="plus"
                size={size}
                color={
                  themes[scheme === 'dark' ? 'dark' : 'light'].colors.secondary
                }
              />
            </View>
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate('NewArticle');
          },
        })}
      />
      <Tab.Screen
        name="More"
        component={MyScreen}
        options={{
          tabBarLabel: '더보기',
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="menu"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export type RootStackParamList = {
  AppTabsScreen: undefined;
  NewArticle: {
    url?: string;
  };
  NewNotification: {
    article: Article;
    isNewArticle?: boolean;
  };
  SuccessSaveArticle: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export default function Navigation(): ReactElement {
  const scheme = useColorScheme();

  return (
    <NavigationContainer
      theme={scheme === 'dark' ? willreadDarkTheme : willreadLightTheme}
    >
      <RootStack.Navigator
        headerMode="none"
        mode="modal"
        // initialRouteName="NewArticle"
        initialRouteName="AppTabsScreen"
      >
        <RootStack.Screen
          name="AppTabsScreen"
          component={AppTabsScreen}
        />
        <RootStack.Screen
          name="NewArticle"
          component={NewArticleScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />
        <RootStack.Screen
          name="SuccessSaveArticle"
          component={SuccessSaveArticleScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureDirection: 'horizontal',
          }}
        />
        <RootStack.Screen
          name="NewNotification"
          component={NewNotificationScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
