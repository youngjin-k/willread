import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import haptics from '../utils/haptics';

const show = (options: Parameters<typeof Toast.show>[0]) => {
  haptics.notification();
  Toast.show({
    ...options,
    type: 'willread',
    visibilityTime: 3000,
    topOffset: Platform.OS === 'ios' ? 40 : 16,
  });
};

const showSimple = (text: string) => {
  haptics.notification();
  Toast.show({
    text1: text,
    type: 'willread',
    visibilityTime: 3000,
    topOffset: Platform.OS === 'ios' ? 40 : 16,
  });
};

export default {
  show,
  showSimple,
  hide: Toast.hide,
};
