import React from 'react';
import Modal from 'react-native-modal';
import styled from 'styled-components/native';
import Button, { ButtonVariant } from '../Button';

const buttonVariantByStyle = {
  default: ButtonVariant.PrimaryText,
  cancel: ButtonVariant.DefaultText,
  destructive: ButtonVariant.DangerText,
};

export interface AlertProps {
  title?: string;
  message?: string;
  visible: boolean;
  buttons: {
    text: string;
    style: 'default' | 'cancel' | 'destructive';
    onPress?: () => void;
  }[];
  onClose: () => void;
}

function Alert({
  title,
  message,
  visible,
  buttons,
  onClose,
}: AlertProps): React.ReactElement {
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
            <MessageWrapper>
              <Message>{message}</Message>
            </MessageWrapper>
          </Main>
          <Actions>
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
  background-color: ${(props) => props.theme.colors.background};
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
  color: ${(props) => props.theme.colors.typography.title};
  font-weight: 700;
`;

const MessageWrapper = styled.View`
  margin-bottom: 16px;
`;

const Message = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.title};
`;

const Actions = styled.View`
  flex-direction: row;
  padding: 0 16px 16px 16px;
`;

const ActionSeparator = styled.View`
  width: 1px;
  margin: 8px 16px;
  background-color: ${(props) => props.theme.colors.grey1};
`;

const ActionWrapper = styled.View`
  flex: 1;
`;

export default Alert;
