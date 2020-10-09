import React, { ReactElement } from 'react';
import { StatusBar } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/native';

import Navigation from './src/config/Navigation';
import store from './src/features/store';
import themes from './src/lib/styles/themes';

export default function App(): ReactElement {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const statusBarBackgroundColor = themes[isDark ? 'dark' : 'light'].colors.background;
  const statusBarStyle = isDark ? 'light-content' : 'dark-content';

  return (
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <AppearanceProvider>
        <StatusBar
          backgroundColor={statusBarBackgroundColor}
          barStyle={statusBarStyle}
        />
        <ThemeProvider theme={isDark ? themes.dark : themes.light}>
          <Navigation />
        </ThemeProvider>
      </AppearanceProvider>
      {/* </PersistGate> */}
    </Provider>
  );
}
