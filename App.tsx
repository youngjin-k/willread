/* eslint-disable react/display-name */
import React, { ReactElement } from 'react';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { ThemeProvider } from 'styled-components/native';
import { StatusBar } from 'react-native';
import themes from './src/lib/styles/themes';
import Navigation from './src/config/Navigation';

export default function App(): ReactElement {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const statusBarBackgroundColor = themes[isDark ? 'dark' : 'light'].colors.background;
  const statusBarStyle = isDark ? 'light-content' : 'dark-content';

  return (
    <AppearanceProvider>
      <StatusBar
        backgroundColor={statusBarBackgroundColor}
        barStyle={statusBarStyle}
      />
      <ThemeProvider theme={isDark ? themes.dark : themes.light}>
        <Navigation />
      </ThemeProvider>
    </AppearanceProvider>
  );
}
