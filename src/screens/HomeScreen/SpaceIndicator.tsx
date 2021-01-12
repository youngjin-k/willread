import React from 'react';
import styled, { css } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';

export interface SpaceIndicatorProps {
  usage: number;
}

const SPACE = 14;

function SpaceIndicator({ usage }: SpaceIndicatorProps) {
  const usableSpace = SPACE - usage;
  const isOver = usage > SPACE;

  return (
    <SpaceIndicatorBlock>
      <BookmarkIcon name="bookmark" />
      <Usage isOver={isOver}>{usableSpace}</Usage>
      <Separator>/</Separator>
      <Space>{SPACE}</Space>
      <HelpCircleIcon name="help-circle" />
    </SpaceIndicatorBlock>
  );
}

const SpaceIndicatorBlock = styled.View`
  height: 32px;
  padding: 0 12px;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.background};
  flex-direction: row;
  border: 1px solid ${(props) => props.theme.colors.border};
`;

const BookmarkIcon = styled(Icon)`
  font-size: 14px;
  color: ${(props) => props.theme.colors.primary};
  margin: 1px 6px 0 0;
`;

const Usage = styled.Text<{ isOver: boolean }>`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 700;
  font-size: 12px;

  ${(props) => props.isOver
    && css`
      color: ${props.theme.colors.danger};
    `}
`;

const Separator = styled.Text`
  color: ${(props) => props.theme.colors.typography.secondary};
  font-size: 12px;
  padding: 0 2px;
`;

const Space = styled.Text`
  color: ${(props) => props.theme.colors.typography.secondary};
  font-size: 12px;
`;

const HelpCircleIcon = styled(Icon)`
  font-size: 14px;
  color: ${(props) => props.theme.colors.typography.secondary};
  margin: 0 0 0 6px;
`;

export default SpaceIndicator;
