import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ModalHandle from './ModalHandle';
import haptics from '../lib/utils/haptics';

export interface BottomModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode | React.ReactNode[];
  useSafeAreaView?: boolean;
  hapticOnVisible?: boolean;
}

function BottomModal({
  isVisible,
  onClose,
  children,
  useSafeAreaView = true,
  hapticOnVisible = true,
}: BottomModalProps) {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!isVisible || !hapticOnVisible) {
      return;
    }

    haptics.selection();
  }, [isVisible, hapticOnVisible]);

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      onBackButtonPress={onClose}
      swipeDirection="down"
      backdropTransitionOutTiming={0}
      propagateSwipe
      style={{
        justifyContent: 'flex-end',
        alignSelf: 'center',
        margin: 0,
        maxWidth: 560,
        width: '100%',
      }}
    >
      <BottomModalContainerBlock>
        <SafeAreaView as={useSafeAreaView === false ? View : undefined}>
          <ModalHandle />
          <Main hasHomeBar={insets.bottom > 0}>
            {children}
          </Main>
        </SafeAreaView>
      </BottomModalContainerBlock>
    </Modal>
  );
}

const BottomModalContainerBlock = styled.View`
`;

const SafeAreaView = styled.SafeAreaView`
  background-color: ${(props) => props.theme.colors.backgroundElevated};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  width: 100%;
`;

const Main = styled.View<{hasHomeBar: boolean;}>`
  padding: 0 0 ${(props) => (props.hasHomeBar ? '0' : '16px')} 0;
`;

export default BottomModal;
