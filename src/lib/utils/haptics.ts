import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const selection = () => {
  if (Platform.OS !== 'ios') {
    return;
  }

  Haptics.selectionAsync();
};

const notification = () => {
  if (Platform.OS !== 'ios') {
    return;
  }

  Haptics.notificationAsync();
};

export default {
  selection,
  notification,
};
