import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useState } from 'react';
import { Share } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

import ArticleListCard from '../../components/articleCard/ArticleListCard';
import Button, { ButtonVariant } from '../../components/Button';
import Line from '../../components/Line';
import { RootStackParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import useArticle from '../../features/article/useArticle';
import CancelNotificationConfirm from './CancelNotificationConfirm';
import RemoveConfirm from './RemoveConfirm';

export interface ArticleMenuProps {
  article: Article;
  onClose: () => void;
  onRemove: () => void;
}

function ArticleMenu({
  article,
  onClose,
  onRemove,
}: ArticleMenuProps): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {
    resetLastReadAt, scheduledNotifications, removeScheduledNotification,
  } = useArticle();
  const [visibleRemoveAlert, setVisibleRemoveAlert] = useState(false);
  const [visiblCancelNotificationAlert, setVisibleCancelNotificationAlert] = useState(false);

  const openRemoveAlert = () => {
    setVisibleRemoveAlert(true);
  };
  const closeRemoveAlert = () => {
    setVisibleRemoveAlert(false);
  };

  const openCancelNotificationAlert = () => {
    setVisibleCancelNotificationAlert(true);
  };
  const closeCancelNotificationAlert = () => {
    setVisibleCancelNotificationAlert(false);
  };

  const scheduledNotification = useMemo(
    () => scheduledNotifications.find(
      (notification) => {
        const now = dayjs();
        return notification.articleId === article.id && !dayjs(notification.date).isBefore(now);
      },
    ),
    [scheduledNotifications, article],
  );

  const isSetNotification = !!scheduledNotification;

  const notificationDate = useMemo(() => {
    if (!scheduledNotification) {
      return null;
    }

    const date = dayjs(scheduledNotification.date);

    return date.format(
      `M월 D일 ${date.format('a') === 'am' ? '오전' : '오후'} h:mm`,
    );
  }, [scheduledNotification]);

  const handlePressNewNotification = useCallback(() => {
    onClose();
    navigation.navigate('NewNotification', {
      article,
    });
  }, [navigation, article, onClose]);

  const handleRemoveArticle = useCallback(() => {
    closeRemoveAlert();
    setTimeout(() => {
      onClose();
      onRemove();
    });
  }, [onRemove, onClose]);

  const handleCancelNotification = useCallback(() => {
    closeCancelNotificationAlert();
    onClose();

    if (!scheduledNotification) {
      return;
    }

    setTimeout(() => {
      removeScheduledNotification(scheduledNotification.id);
    }, 200);
  }, [scheduledNotification, removeScheduledNotification, onClose]);

  const handlePressSharing = useCallback(() => {
    Share.share({
      message: `${article.title} - ${article.url}`,
    });
  }, [article]);

  const handlePressSetUnread = useCallback(() => {
    resetLastReadAt(article);
    onClose();
  }, [article, onClose, resetLastReadAt]);

  return (
    <>
      <ArticleCardWrapper>
        <ArticleListCard article={article} />
      </ArticleCardWrapper>

      <Line />

      <MenuList>
        <ButtonWrapper>
          <Button
            variant={ButtonVariant.DefaultText}
            onPress={handlePressSharing}
          >
            <ButtonContent>
              <ButtonIcon name="share" />
              <ButtonText>공유</ButtonText>
            </ButtonContent>
          </Button>
        </ButtonWrapper>

        {isSetNotification ? (
          <ButtonWrapper>
            <Button
              variant={ButtonVariant.DefaultText}
              onPress={openCancelNotificationAlert}
            >
              <ButtonContent>
                <ButtonIcon name="bell-off" />
                <ButtonText>알림 해제</ButtonText>
                <ButtonSubText>{notificationDate}</ButtonSubText>
              </ButtonContent>
            </Button>
          </ButtonWrapper>
        ) : (
          <ButtonWrapper>
            <Button
              variant={ButtonVariant.DefaultText}
              onPress={handlePressNewNotification}
            >
              <ButtonContent>
                <ButtonIcon name="bell" />
                <ButtonText>알림 설정</ButtonText>
              </ButtonContent>
            </Button>
          </ButtonWrapper>
        )}

        {!!article.lastReadAt && (
          <ButtonWrapper>
            <Button
              variant={ButtonVariant.DefaultText}
              onPress={handlePressSetUnread}
            >
              <ButtonContent>
                <ButtonIcon name="book" />
                <ButtonText>읽지 않은 상태로 변경</ButtonText>
              </ButtonContent>
            </Button>
          </ButtonWrapper>
        )}

        <ButtonWrapper>
          <Button
            variant={ButtonVariant.DefaultText}
            onPress={openRemoveAlert}
          >
            <ButtonContent>
              <ButtonIcon name="trash" />
              <ButtonText>삭제</ButtonText>
            </ButtonContent>
          </Button>
        </ButtonWrapper>
      </MenuList>

      <RemoveConfirm
        visible={visibleRemoveAlert}
        article={article}
        onClose={closeRemoveAlert}
        onConfirm={handleRemoveArticle}
      />

      <CancelNotificationConfirm
        visible={visiblCancelNotificationAlert}
        onClose={closeCancelNotificationAlert}
        onConfirm={handleCancelNotification}
      />
    </>
  );
}

const ArticleCardWrapper = styled.View`
  padding: 0 0 8px 0;
`;

const MenuList = styled.View`
  margin-top: 8px;
  padding: 0 16px;
`;

const ButtonWrapper = styled.View`
  margin-top: 8px;
`;

const ButtonContent = styled.View`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
`;

const ButtonIcon = styled(Icon)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.primary};
  margin-right: 16px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.primary};
  flex: 1;
`;

const ButtonSubText = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.typography.secondary};
  margin-left: 8px;
`;

export default ArticleMenu;
