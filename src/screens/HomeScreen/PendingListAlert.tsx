import React, { useMemo } from 'react';
import styled, { css } from 'styled-components/native';
import Icon from 'react-native-vector-icons/Feather';
import { GestureResponderEvent } from 'react-native';
import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import useArticle from '../../features/article/useArticle';
import useTheme from '../../lib/styles/useTheme';

export interface PendingListAlertProps {
  onPress: (event: GestureResponderEvent) => void;
}

function PendingListAlert({ onPress }: PendingListAlertProps) {
  const { pendingList } = useArticle();
  const theme = useTheme();

  const hasPendingList = useMemo(() => pendingList.length > 0, [pendingList]);

  if (!hasPendingList) {
    return null;
  }

  return (
    <PendingListAlertBlock>
      <Button
        size={ButtonSize.Medium}
        variant={ButtonVariant.DefaultText}
        style={{
          borderWidth: 1,
          borderColor: theme.colors.border,
          borderRadius: 12,
        }}
        onPress={onPress}
      >
        <Content>
          <AlertIcon name="alert-circle" />
          <ButtonLabel>{'등록 대기 중인 아티클이 '}</ButtonLabel>
          <ButtonLabel accent>{`${pendingList.length}개 `}</ButtonLabel>
          <ButtonLabel>있어요.</ButtonLabel>
        </Content>
      </Button>
    </PendingListAlertBlock>
  );
}

const PendingListAlertBlock = styled.View`
  margin: 16px 0 32px 0;
  padding: 0 16px;
`;

const Content = styled.View`
  flex-direction: row;
  flex: 1;
  padding: 0 16px;
  align-items: center;
`;

const AlertIcon = styled(Icon)`
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.primary};
  margin: 0 8px 0 0;
`;

const ButtonLabel = styled.Text<{ accent?: boolean }>`
  font-size: 14px;
  color: ${(props) => props.theme.colors.typography.primary};

  ${(props) => props.accent
    && css`
      color: ${props.theme.colors.typography.point};
      font-weight: bold;
    `}
`;

export default PendingListAlert;
