import React from 'react';
import Alert from '../../components/Alert';

export interface CancelNotificationConfirmProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function CancelNotificationConfirm({
  visible,
  onClose,
  onConfirm,
}: CancelNotificationConfirmProps) {
  return (
    <Alert
      visible={visible}
      title="알림 해제"
      message="설정된 알림을 해제할까요?"
      onClose={onClose}
      buttons={[
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '확인',
          style: 'destructive',
          onPress: onConfirm,
        },
      ]}
    />
  );
}

export default CancelNotificationConfirm;
