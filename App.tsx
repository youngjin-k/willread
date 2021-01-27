import 'react-native-gesture-handler';
import React, { ReactElement, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';

import { PersistGate } from 'redux-persist/integration/react';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import SplashScreen from 'react-native-splash-screen';
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

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 300);
  }, []);

  return (
    <ThemeProvider theme={isDark ? themes.dark : themes.light}>
      <Provider store={store}>
        <PersistGate
          loading={null}
          persistor={persistor}
        >
          <AppearanceProvider>
            <StatusBar
              backgroundColor={statusBarBackgroundColor}
              barStyle={statusBarStyle}
            />
            <Navigation />
          </AppearanceProvider>
        </PersistGate>
      </Provider>
      <Toast
        ref={(ref) => Toast.setRef(ref)}
        config={toastConfig}
      />
    </ThemeProvider>
  );
}
