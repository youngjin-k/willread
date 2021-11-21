/* eslint-disable react/display-name */
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
import { View, useColorScheme } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import themes from '../../lib/styles/themes';
import { Article } from '../../features/article/articles';
import useTheme from '../../lib/styles/useTheme';
import HomeScreen from '../../screens/HomeScreen';
import NewArticleScreen from '../../screens/NewArticleScreen';
import NewNotificationScreen from '../../screens/NewNotificationScreen';
import SuccessSaveArticleScreen from '../../screens/SuccessSaveArticleScreen';
import Menu from './Menu';
import SuccessSavePendingListScreen from '../../screens/SuccessSavePendingListScreen';
import WillreadLogoTitle from '../../components/WillreadLogoTItle';

export type TabParamList = {
  Home: {
    setScrollTop?: boolean;
    setScrollBottom?: boolean;
    openPendingList?: boolean;
  };
  Add: undefined;
  Menu: undefined;
};
const Tab = createBottomTabNavigator<TabParamList>();

const willreadLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: themes.light.colors.typography.primary,
    background: themes.light.colors.background,
    card: themes.light.colors.backgroundElevated,
    text: themes.light.colors.typography.secondary,
  },
};

const willreadDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: themes.dark.colors.typography.primary,
    background: themes.dark.colors.background,
    card: themes.dark.colors.backgroundElevated,
    text: themes.dark.colors.typography.secondary,
  },
};

const NewArticleScreenPlaceholder = () => null;

function AppTabsScreen() {
  const theme = useTheme();

  return (
    <Tab.Navigator screenOptions={{
      tabBarShowLabel: false,
      headerStyle: {
        backgroundColor: theme.colors.background,
      },
      headerTitleStyle: {
        color: theme.colors.typography.primary,
      },
      headerShadowVisible: false,
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
          headerTitle: () => <WillreadLogoTitle />,
          headerTitleAlign: 'left',
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
                backgroundColor: theme.colors.primary,
                borderRadius: 6,
              }}
            >
              <Icon
                name="plus"
                size={size}
                color={theme.colors.backgroundElevated}
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
        name="Menu"
        component={Menu}
        options={{
          headerShown: false,
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
  SuccessSavePendingList: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export default function Navigation(): ReactElement {
  const scheme = useColorScheme();

  return (
    <NavigationContainer
      theme={scheme === 'dark' ? willreadDarkTheme : willreadLightTheme}
    >
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          presentation: 'modal',
        }}
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
          name="SuccessSavePendingList"
          component={SuccessSavePendingListScreen}
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
