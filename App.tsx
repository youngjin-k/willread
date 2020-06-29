import { StatusBar } from 'expo-status-bar';
import React, { ReactElement } from 'react';
import {
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';

import HomeScreen from './src/components/HomeScreen';
import MyScreen from './src/components/MyScreen';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
  },
  test: {
  },
  tabItem: {

  },
});

export default function App(): JSX.Element {
  return (
    <>
      <StatusBar />
      <NavigationContainer>
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
                <MaterialCommunityIcons name="home-variant" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Search"
            component={HomeScreen}
            options={{
              tabBarLabel: '검색',
              tabBarIcon: ({ color, size }) => (
                <Feather name="search" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="add"
            component={HomeScreen}
            options={{
              tabBarLabel: '추가',
              tabBarIcon: ({ color, size }) => (
                <Feather name="plus" size={size} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="history"
            component={HomeScreen}
            options={{
              tabBarLabel: '기록',
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="history" size={size} color={color} />
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
      </NavigationContainer>
    </>
  );
}
