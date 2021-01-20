import React, { ReactElement } from 'react';
import {
  GestureResponderEvent, Platform, Pressable, View,
} from 'react-native';
import { useColorScheme } from 'react-native-appearance';

export interface PressableWrapperProps {
  children: ReactElement;
  pressable?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  onLongPress: (event: GestureResponderEvent) => void;
}

function PressableWrapper({
  children,
  pressable = true,
  onPress,
  onLongPress,
}: PressableWrapperProps): ReactElement {
  const scheme = useColorScheme();
  const effectColor = scheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  if (!pressable) {
    return <View style={{ paddingHorizontal: 8 }}>{children}</View>;
  }

  return (
    <View
      style={{
        marginHorizontal: 8,
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        android_ripple={{
          color: effectColor,
        }}
        style={({ pressed }) => [
          Platform.OS === 'ios' && pressed
            ? {
              backgroundColor: effectColor,
            }
            : null,
        ]}
      >
        {children}
      </Pressable>
    </View>
  );
}

export default PressableWrapper;
