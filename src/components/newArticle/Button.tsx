import React, { ReactElement, ReactChild } from 'react';
import styled, { css } from 'styled-components/native';
import { TouchableOpacity, GestureResponderEvent, ActivityIndicator } from 'react-native';

export interface ButtonProps {
    onPress?: (event: GestureResponderEvent) => void;
    children: ReactChild;
    loading?: boolean;
    disabled?: boolean;
}

function Button({
  onPress,
  children,
  loading,
  disabled,
}: ButtonProps): ReactElement {
  const handler = (event: GestureResponderEvent) => {
    if (disabled || loading) {
      return;
    }

    if (onPress) {
      onPress(event);
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handler}
      disabled={disabled || loading}
    >
      <ButtonBlock disabled={disabled || loading}>
        {loading
          ? <ActivityIndicator size="small" />
          : <ButtonText disabled={disabled || loading}>{children}</ButtonText>}
      </ButtonBlock>
    </TouchableOpacity>
  );
}

const ButtonBlock = styled.View<{disabled?: boolean}>`
  height: 56px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  ${(props) => (props.disabled
    ? css`background-color: ${props.theme.colors.grey1}`
    : css`background-color: ${props.theme.colors.primary}`)
}
`;

const ButtonText = styled.Text<{disabled?: boolean}>`
  font-size: 18px;
  font-weight: bold;


  ${(props) => (props.disabled
    ? css`color: ${props.theme.colors.grey2}`
    : css`color: #F9F9FD;`)
}
`;

export default Button;
