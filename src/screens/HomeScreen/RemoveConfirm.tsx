import React from 'react';
import Alert from '../../components/Alert';
import { Article } from '../../features/article/articles';

export interface RemoveConfirmProps {
  visible: boolean;
  onClose: () => void;
  article: Article;
  onConfirm: () => void;
}

function RemoveConfirm({
  visible,
  onClose,
  article,
  onConfirm,
}: RemoveConfirmProps) {
  return (
    <Alert
      visible={visible}
      title={
      article.title.length < 40
        ? article.title
        : `${article.title.slice(0, 40)}...`
    }
      message="이 아티클을 삭제할까요?"
      onClose={onClose}
      buttons={[
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: onConfirm,
        },
      ]}
    />
  );
}

export default RemoveConfirm;
