import React, { ReactElement, useEffect } from 'react';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { ThemeProvider } from 'styled-components/native';
import { StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import themes from './src/lib/styles/themes';
import Navigation from './src/config/Navigation';
import store from './src/features/store';

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
