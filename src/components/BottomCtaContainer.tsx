import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { css } from 'styled-components/native';
import useKeyboardShown from '../lib/hooks/useKeyboardShown';

type BottomCtaContainerProps = {
  children: ReactNode;
  topAccessory?: ReactNode;
  fixed?: boolean;
}

export default function BottomCtaContainer({
  children,
  topAccessory,
  fixed = false,
}: BottomCtaContainerProps) {
  const insets = useSafeAreaInsets();
  const keyboardShown = useKeyboardShown();

  return (
    <BottomCtaContainerBlock
      keyboardShown={keyboardShown}
      hasHomeBar={insets.bottom > 0}
      fixed={fixed}
    >
      <View>
        {topAccessory}
      </View>
      {children}
    </BottomCtaContainerBlock>
  );
}

const BottomCtaContainerBlock = styled.View<{
  keyboardShown: boolean;
  hasHomeBar: boolean;
  fixed: boolean
}>`
  padding: 16px;
  
  ${(props) => props.hasHomeBar && css`
    padding-bottom: 0;
  `}

  ${(props) => props.fixed && css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
    height: ${64 + 16 + (!props.keyboardShown && props.hasHomeBar ? 0 : 16)}px;
  `}
  
  ${(props) => props.keyboardShown && css`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
  `}
`;
