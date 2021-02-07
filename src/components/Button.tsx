import React, { ReactElement } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  useColorScheme,
  ViewStyle,
} from 'react-native';
import styled from 'styled-components/native';

import themes from '../lib/styles/themes';

export enum ButtonVariant {
  DefaultText = 'DefaultText',
  PrimaryText = 'PrimaryText',
  PrimaryContained = 'PrimaryContained',
  PrimaryTenderContained = 'PrimaryTenderContained',
  DangerText = 'DangerText',
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
      case ButtonVariant.DangerText:
        return 'transparent';
      case ButtonVariant.PrimaryContained:
        return themes[appearance].colors.buttonDisabled;
      case ButtonVariant.PrimaryTenderContained:
        return themes[appearance].colors.buttonDisabled;
      default:
        return '';
    }
  }

  switch (variant) {
    case ButtonVariant.DefaultText:
      return 'transparent';
    case ButtonVariant.PrimaryText:
      return 'transparent';
    case ButtonVariant.DangerText:
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
    return themes[appearance].colors.typography.disabled;
  }

  switch (variant) {
    case ButtonVariant.DefaultText:
      return themes[appearance].colors.typography.primary;
    case ButtonVariant.PrimaryText:
      return themes[appearance].colors.typography.point;
    case ButtonVariant.DangerText:
      return themes[appearance].colors.danger;
    case ButtonVariant.PrimaryContained:
      return '#ffffff';
    case ButtonVariant.PrimaryTenderContained:
      return themes[appearance].colors.typography.point;
    default:
      return '';
  }
};

export const buttonPressedColor = (
  variant: ButtonVariant,
  dark: boolean,
): string => {
  const appearance = dark ? 'dark' : 'light';
  switch (variant) {
    case ButtonVariant.DefaultText:
      return dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    case ButtonVariant.PrimaryText:
      return themes[appearance].colors.primaryTender;
    case ButtonVariant.DangerText:
      return themes[appearance].colors.dangerTender;
    case ButtonVariant.PrimaryContained:
      return 'rgba(255, 255, 255, 0.2)';
    case ButtonVariant.PrimaryTenderContained:
      return themes[appearance].colors.primaryTender;
    default:
      return '';
  }
};

export type ButtonProps = PressableProps & {
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
  children,
  label,
  style,
  ...others
}: ButtonProps): ReactElement {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const isLoading = disabled || loading;

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
    <ButtonBlock
      size={size}
      style={{
        backgroundColor: buttonBackgroundColor(variant, isDark, isLoading),
      }}
    >
      <Pressable
        android_ripple={{
          color: buttonPressedColor(variant, isDark),
        }}
        style={({ pressed }) => [
          {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            height: buttonHeight[size],
          },
          Platform.OS === 'ios' && pressed
            ? {
              backgroundColor: buttonPressedColor(variant, isDark),
            }
            : null,
          style,
        ]}
        disabled={isLoading}
        {...others}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={buttonTextColor(variant, isDark, false)}
          />
        ) : (
          ButtonContent
        )}
      </Pressable>
    </ButtonBlock>
  );
}

const ButtonBlock = styled.View<Required<Pick<ButtonProps, 'size'>>>`
  border-radius: ${(props) => `${buttonHeight[props.size] / 4}px`};
  overflow: hidden;
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
