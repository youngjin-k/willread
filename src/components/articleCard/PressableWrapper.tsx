import React, { ReactElement } from 'react';
import {
  GestureResponderEvent, Platform, Pressable, TouchableOpacity, View,
} from 'react-native';
import { useColorScheme } from 'react-native-appearance';

export interface PressableWrapperProps {
    children: ReactElement;
    onPress: (event: GestureResponderEvent) => void;
    onLongPress: (event: GestureResponderEvent) => void;
  }

function PressableWrapper({
  children,
  onPress,
  onLongPress,
}: PressableWrapperProps): ReactElement {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  if (Platform.OS === 'ios') {
    return (
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        style={{ paddingHorizontal: 8 }}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={{
      marginHorizontal: 8,
      borderRadius: 16,
      overflow: 'hidden',
    }}
    >
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        android_ripple={{
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }}
      >
        {children}
      </Pressable>
    </View>
  );
}

export default PressableWrapper;
