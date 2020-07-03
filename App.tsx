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

  return (
    <AppearanceProvider>
      <StatusBar backgroundColor={themes[isDark ? 'dark' : 'light'].colors.background} />
      <ThemeProvider theme={isDark ? themes.dark : themes.light}>
        <Navigation />
      </ThemeProvider>
    </AppearanceProvider>
  );
}
