import React, { ReactElement, useRef } from 'react';
import styled from 'styled-components/native';
import {
  TouchableWithoutFeedbackProps,
  GestureResponderEvent,
  ActivityIndicator,
  useColorScheme,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';
import themes from '../lib/styles/themes';

export enum ButtonVariant {
  DefaultText = 'DefaultText',
  PrimaryText = 'PrimaryText',
  PrimaryContained = 'PrimaryContained',
  PrimaryTenderContained = 'PrimaryTenderContained',
}

export enum ButtonSize {
  Small = 'Small',
  Medium = 'Medium',
  Large = 'Large',
}

export const buttonFontSize: { [key in keyof typeof ButtonSize]: number } = {
  [ButtonSize.Large]: 18,
  [ButtonSize.Medium]: 17,
  [ButtonSize.Small]: 16,
};

export const buttonHeight: { [key in keyof typeof ButtonSize]: number } = {
  [ButtonSize.Large]: 64,
  [ButtonSize.Medium]: 48,
  [ButtonSize.Small]: 32,
};

export const buttonBackgroundColor = (
  variant: ButtonVariant,
  dark: boolean,
  disabled: boolean,
): string => {
  const appearance = dark ? 'dark' : 'light';

  if (disabled) {
    switch (variant) {
      case ButtonVariant.DefaultText:
        return 'transparent';
      case ButtonVariant.PrimaryText:
        return 'transparent';
      case ButtonVariant.PrimaryContained:
        return themes[appearance].colors.grey1;
      case ButtonVariant.PrimaryTenderContained:
        return themes[appearance].colors.grey1;
      default:
        return '';
    }
  }

  switch (variant) {
    case ButtonVariant.DefaultText:
      return 'transparent';
    case ButtonVariant.PrimaryText:
      return 'transparent';
    case ButtonVariant.PrimaryContained:
      return themes[appearance].colors.primary;
    case ButtonVariant.PrimaryTenderContained:
      return themes[appearance].colors.primaryTender;
    default:
      return '';
  }
};

export const buttonTextColor = (
  variant: ButtonVariant,
  dark: boolean,
  disabled: boolean,
): string => {
  const appearance = dark ? 'dark' : 'light';

  if (disabled) {
    return themes[appearance].colors.grey2;
  }

  switch (variant) {
    case ButtonVariant.DefaultText:
      return themes[appearance].colors.typography.title;
    case ButtonVariant.PrimaryText:
      return themes[appearance].colors.primary;
    case ButtonVariant.PrimaryContained:
      return '#ffffff';
    case ButtonVariant.PrimaryTenderContained:
      return themes[appearance].colors.primary;
    default:
      return '';
  }
};

export const buttonBackDropColor = (
  variant: ButtonVariant,
  dark: boolean,
): string => {
  const appearance = dark ? 'dark' : 'light';
  switch (variant) {
    case ButtonVariant.DefaultText:
      return dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    case ButtonVariant.PrimaryText:
      return themes[appearance].colors.primaryTender;
    case ButtonVariant.PrimaryContained:
      return 'rgba(255, 255, 255, 0.2)';
    case ButtonVariant.PrimaryTenderContained:
      return themes[appearance].colors.primaryTender;
    default:
      return '';
  }
};

export type ButtonProps = TouchableWithoutFeedbackProps & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children?: ReactElement;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

function Button({
  variant = ButtonVariant.PrimaryContained,
  size = ButtonSize.Medium,
  disabled = false,
  loading = false,
  onPress,
  children,
  label,
  style,
  ...others
}: ButtonProps): ReactElement {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const isLoading = disabled || loading;
  const scaleValue = useRef(new Animated.Value(0.95)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;

  const handleOnPress = (event: GestureResponderEvent) => {
    if (onPress) {
      onPress(event);
    }
  };

  const handleOnPressIn = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacityValue, {
      toValue: 1,
      duration: 240,
      useNativeDriver: true,
    }).start();
  };

  const handleOnPressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }).start();

    Animated.timing(opacityValue, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const ButtonContent = label ? (
    <ButtonText
      disabled={isLoading}
      size={size}
      variant={variant}
      dark={isDark}
    >
      {label}
    </ButtonText>
  ) : (
    children
  );

  return (
    <Touchable
      onPress={handleOnPress}
      onPressIn={handleOnPressIn}
      onPressOut={handleOnPressOut}
      disabled={isLoading}
      {...others}
    >
      <ButtonBlock
        style={style}
        disabled={isLoading}
        size={size}
        variant={variant}
        dark={isDark}
      >
        <BackDrop
          size={size}
          variant={variant}
          dark={isDark}
          style={{
            opacity: opacityValue,
            transform: [{
              scale: scaleValue,
            }],
          }}
        />
        {loading ? (
          <ActivityIndicator
            size="small"
            color={buttonTextColor(variant, isDark, false)}
          />
        ) : (
          ButtonContent
        )}
      </ButtonBlock>
    </Touchable>
  );
}

const Touchable = styled.TouchableWithoutFeedback``;

type ButtonBlockProps = Required<
  Pick<ButtonProps, 'disabled' | 'variant' | 'size'>
> & {
  dark: boolean;
};
const ButtonBlock = styled.View<ButtonBlockProps>`
  align-items: center;
  justify-content: center;
  flex-direction: row;
  height: ${(props) => `${buttonHeight[props.size]}px`};
  border-radius: ${(props) => `${buttonHeight[props.size] / 4}px`};
  background-color: ${(props) => buttonBackgroundColor(props.variant, props.dark, props.disabled)};
`;

type BackDropProps = Required<
  Pick<ButtonProps, 'variant' | 'size'>
> & {
  dark: boolean;
};
const BackDrop = styled(Animated.View)<BackDropProps>`
  height: ${(props) => `${buttonHeight[props.size]}px`};
  border-radius: ${(props) => `${buttonHeight[props.size] / 4}px`};
  background-color: ${(props) => buttonBackDropColor(props.variant, props.dark)};
  flex: 1;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;

type ButtonTextProps = Required<
  Pick<ButtonProps, 'disabled' | 'variant' | 'size'>
> & {
  dark: boolean;
};
const ButtonText = styled.Text<ButtonTextProps>`
  font-size: ${(props) => `${buttonFontSize[props.size]}px`};
  font-weight: bold;
  color: ${(props) => buttonTextColor(props.variant, props.dark, props.disabled)};
`;

export default Button;
