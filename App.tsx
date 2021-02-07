import 'react-native-gesture-handler';

import * as Notifications from 'expo-notifications';
import React, { ReactElement } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components/native';

import Navigation from './src/config/Navigation';
import store, { persistor } from './src/features/store';
import themes from './src/lib/styles/themes';
import { toastConfig } from './src/lib/willreadToast/ToastTemplate';

Icon.loadFont();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App(): ReactElement {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const statusBarBackgroundColor = themes[isDark ? 'dark' : 'light'].colors.background;
  const statusBarStyle = isDark ? 'light-content' : 'dark-content';

  return (
    <ThemeProvider theme={isDark ? themes.dark : themes.light}>
      <Provider store={store}>
        <PersistGate
          loading={null}
          persistor={persistor}
        >
          <StatusBar
            backgroundColor={statusBarBackgroundColor}
            barStyle={statusBarStyle}
          />
          <Navigation />
        </PersistGate>
      </Provider>
      <Toast
        ref={(ref) => Toast.setRef(ref)}
        config={toastConfig}
      />
    </ThemeProvider>
  );
}
