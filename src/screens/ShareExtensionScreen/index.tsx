import React, { useEffect } from 'react';
import { ActivityIndicator, View, useColorScheme } from 'react-native';
import { ShareMenuReactView } from 'react-native-share-menu';

import themes from '../../lib/styles/themes';

function ShareExtensionScreen() {
  const scheme = useColorScheme();
  const appearance = scheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    setTimeout(() => {
      ShareMenuReactView.continueInApp();
    }, 1000);
  }, []);

  return (
    <View
      style={{
        padding: 16,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: themes[appearance].colors.backgroundElevated,
      }}
    >
      <ActivityIndicator color={themes[appearance].colors.typography.point} />
    </View>
  );
}

export default ShareExtensionScreen;
