import React, { ReactNode, useEffect } from 'react';
import Modal from 'react-native-modal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import haptics from '../../lib/utils/haptics';
import Button, { ButtonVariant } from '../Button';

const buttonVariantByStyle = {
  default: ButtonVariant.PrimaryText,
  cancel: ButtonVariant.DefaultText,
  destructive: ButtonVariant.DangerText,
};

export interface AlertProps {
  title?: string;
  message?: string | ReactNode;
  visible: boolean;
  buttons: {
    text: string;
    style: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
  }[];
  onClose: () => void;
  hapticOnVisible?: boolean;
}

function Alert({
  title,
  message,
  visible,
  buttons,
  onClose,
  hapticOnVisible = true,
}: AlertProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible || !hapticOnVisible) {
      return;
    }

    haptics.selection();
  }, [visible, hapticOnVisible]);

  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onClose}
      backdropTransitionOutTiming={0}
      style={{
        justifyContent: 'flex-end',
        alignSelf: 'center',
        margin: 0,
        maxWidth: 560,
        width: '100%',
      }}
    >
      <AlertBlock>
        <SafeAreaView>
          <Main>
            <TitleWrapper>
              <Title>{title}</Title>
            </TitleWrapper>
            {typeof message === 'string' ? (
              <MessageWrapper>
                <Message>{message}</Message>
              </MessageWrapper>
            ) : (
              <MessageWrapper>
                {message}
              </MessageWrapper>
            )}
          </Main>
          <Actions hasHomeBar={insets.bottom > 0}>
            {buttons.map(({ text, style, onPress }, index) => (
              <React.Fragment key={text}>
                {index > 0 && <ActionSeparator />}
                <ActionWrapper>
                  <Button
                    label={text}
                    variant={buttonVariantByStyle[style]}
                    onPress={onPress || onClose}
                  />
                </ActionWrapper>
              </React.Fragment>
            ))}
          </Actions>
        </SafeAreaView>
      </AlertBlock>
    </Modal>
  );
}

const AlertBlock = styled.View``;

const SafeAreaView = styled.SafeAreaView`
  background-color: ${(props) => props.theme.colors.backgroundElevated};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  width: 100%;
`;

const Main = styled.View`
  padding: 32px;
`;

const TitleWrapper = styled.View`
  margin-bottom: 32px;
`;

const Title = styled.Text`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.primary};
  font-weight: 700;
`;

const MessageWrapper = styled.View`
  margin-bottom: 16px;
`;

const Message = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.primary};
`;

const Actions = styled.View<{hasHomeBar: boolean;}>`
  flex-direction: row;
  padding: 0 16px ${(props) => (props.hasHomeBar ? '0' : '16px')} 16px;
`;

const ActionSeparator = styled.View`
  width: 1px;
  margin: 8px 16px;
  background-color: ${(props) => props.theme.colors.border};
`;

const ActionWrapper = styled.View`
  flex: 1;
`;

export default Alert;
