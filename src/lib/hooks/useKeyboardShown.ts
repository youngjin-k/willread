import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export default function useKeyboardShown() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardWillShow', () => {
      setShown(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      setShown(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return shown;
}

// export type KeyboardEventName =
//     | 'keyboardWillShow'
//     | 'keyboardDidShow'
//     | 'keyboardWillHide'
//     | 'keyboardDidHide'
//     | 'keyboardWillChangeFrame'
//     | 'keyboardDidChangeFrame';
