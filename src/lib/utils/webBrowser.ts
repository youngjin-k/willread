import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const open = async (url: string) => {
  if (await InAppBrowser.isAvailable()) {
    await InAppBrowser.open(url, {
      // iOS Properties
      readerMode: false,
      animated: true,
      modalPresentationStyle: 'fullScreen',
      modalTransitionStyle: 'coverVertical',
      modalEnabled: false,
      enableBarCollapsing: true,

      // Android Properties
      showTitle: true,
      enableUrlBarHiding: true,
      enableDefaultShare: true,
      forceCloseOnRedirection: false,
    });
  } else {
    Linking.openURL(url);
  }
};

const close = () => {
  InAppBrowser.close();
};

export default {
  open,
  close,
};
