import React, { memo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import styled from '@emotion/native';
import useTheme from '../lib/styles/useTheme';

export interface ScreenHeaderProps {
  isScrolled?: boolean;
  children: ReactNode;
}

function ScreenHeader({ isScrolled = false, children }: ScreenHeaderProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        height: 56,
        backgroundColor: theme.colors.background,
        paddingTop: 0,
        paddingBottom: 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: isScrolled ? theme.colors.border : theme.colors.background,
      }}
    >
      {children}
    </View>
  );
}

export const ScreenHeaderTitle = styled.Text`
  font-weight: bold;
  font-size: 28px;
  color: ${(props) => props.theme.colors.typography.primary};
`;

export default memo(ScreenHeader);
