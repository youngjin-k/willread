/* eslint-disable react/display-name */
import React, { ReactElement } from 'react';
import { useColorScheme } from 'react-native-appearance';
import { DefaultTheme, DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { View } from 'react-native';
import themes from '../../src/lib/styles/themes';
import HomeScreen from '../../src/screens/HomeScreen';
import SearchScreen from '../../src/screens/SearchScreen';
import HistoryScreen from '../../src/screens/HistoryScreen';
import MyScreen from '../../src/screens/MyScreen';
import NewArticleScreen from '../screens/NewArticleScreen';
import ViewerScreen from '../screens/ViewerScreen';
import { Article } from '../features/article/articles';

const Tab = createBottomTabNavigator();

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
    <Tab.Navigator tabBarOptions={{
      showLabel: false,
    }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: '홈',
          tabBarIcon: ({ color, size }) => (
            <Feather name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: '검색',
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="add"
        component={NewArticleScreenPlaceholder}
        options={{
          tabBarLabel: '추가',
          tabBarIcon: ({ size }) => (
            <View style={{
              width: size,
              height: size,
              backgroundColor: themes[scheme === 'dark' ? 'dark' : 'light'].colors.primary,
              borderRadius: 6,
            }}
            >
              <Feather name="plus" size={size} color={themes[scheme === 'dark' ? 'dark' : 'light'].colors.secondary} />
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
        name="history"
        component={HistoryScreen}
        options={{
          tabBarLabel: '기록',
          tabBarIcon: ({ color, size }) => (
            <Feather name="archive" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="My"
        component={MyScreen}
        options={{
          tabBarLabel: '더보기',
          tabBarIcon: ({ color, size }) => (
            <Feather name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export type RootStackParamList = {
  AppTabsScreen: undefined;
  NewArticle: undefined;
  Viewer: {
    item: Article
  };
}

const RootStack = createStackNavigator<RootStackParamList>();

export default function Navigation(): ReactElement {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme === 'dark' ? willreadDarkTheme : willreadLightTheme}>
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
          name="Viewer"
          component={ViewerScreen}
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            gestureDirection: 'horizontal',
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
