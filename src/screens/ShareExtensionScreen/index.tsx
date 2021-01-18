import React, { useEffect } from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import { ShareMenuReactView } from 'react-native-share-menu';
import themes from '../../lib/styles/themes';

const ShareExtensionScreen = () => {
  useEffect(() => {
    ShareMenuReactView.continueInApp();
  }, []);

  return (
    <View style={styles.container}>
      <Text>윌리드 여는 중</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: themes.dark.colors.background,
  },
  text: {
    color: themes.dark.colors.typography.primary,
  },
});

export default ShareExtensionScreen;
