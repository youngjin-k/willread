import React, { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import styled, { css } from '@emotion/native';

export interface ScreenHeaderProps {
  isScrolled?: boolean;
  children: ReactNode;
}

function ScreenHeader({ isScrolled = false, children }: ScreenHeaderProps) {
  return (
    <ScreenHeaderBlock isScrolled={isScrolled}>{children}</ScreenHeaderBlock>
  );
}

const ScreenHeaderBlock = styled.View<{ isScrolled: boolean }>`
  height: 56px;
  background-color: ${(props) => props.theme.colors.background};
  padding: 0 16px 8px 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  border-bottom-color: ${(props) => props.theme.colors.background};

  ${(props) => props.isScrolled
    && css`
      border-bottom-color: ${props.theme.colors.border};
    `}
`;

export const ScreenHeaderTitle = styled.Text`
  font-weight: bold;
  font-size: 28px;
  color: ${(props) => props.theme.colors.typography.primary};
`;

export default ScreenHeader;
