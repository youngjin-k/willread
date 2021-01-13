import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, {
  forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState,
} from 'react';
import { SwipeRow } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

import { DisplayItem } from '.';
import ArticleCard from '../../components/articleCard/ArticleCard';
import ArticleListCard from '../../components/articleCard/ArticleListCard';
import BottomModal from '../../components/BottomModal';
import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import { RootStackParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import useArticle from '../../features/article/useArticle';
import ArticleMenu from './ArticleMenu';
import CancelNotificationConfirm from './CancelNotificationConfirm';
import RemoveConfirm from './RemoveConfirm';

export interface ListItemProps {
  item: DisplayItem;
  onPress: (article: Article) => void;
  setScrollEnabled: (enable: boolean) => void;
  onSwipeMenuOpen: () => void;
  isMainCard?: boolean;
}

const ListItem = forwardRef<SwipeRow<any>, ListItemProps>(({
  item: {
    article,
    timeLeft,
    isSetNotification,
  },
  onPress,
  setScrollEnabled,
  onSwipeMenuOpen,
  isMainCard = false,
}, ref) => {
  const rootRef = useRef<SwipeRow<any>>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [visibleArticleMenu, setVisibleArticleMenu] = useState(false);
  const [visibleRemoveAlert, setVisibleRemoveAlert] = useState(false);
  const [visiblCancelNotificationAlert, setVisibleCancelNotificationAlert] = useState(false);
  const { removeArticle, scheduledNotifications, removeScheduledNotification } = useArticle();

  const scheduledNotification = useMemo(
    () => scheduledNotifications.find(
      (notification) => notification.articleId === article.id,
    ),
    [scheduledNotifications, article],
  );

  const handleRemoveButtonPress = () => {
    closeSwipeMenu();
    setVisibleRemoveAlert(true);
  };

  const closeRemoveAlert = () => {
    setVisibleRemoveAlert(false);
  };

  const handleCancelNotificationButtonPress = () => {
    closeSwipeMenu();
    setVisibleCancelNotificationAlert(true);
  };

  const closeCancelNotificationAlert = () => {
    setVisibleCancelNotificationAlert(false);
  };

  const openArticleMenu = () => {
    setVisibleArticleMenu(true);
  };

  const closeArticleMenu = () => {
    setVisibleArticleMenu(false);
  };

  const handleRemoveArticle = () => {
    closeRemoveAlert();
    removeArticle(article);
  };

  const handleCancelNotification = useCallback(() => {
    if (!scheduledNotification) {
      closeCancelNotificationAlert();
      return;
    }

    closeCancelNotificationAlert();
    removeScheduledNotification(scheduledNotification.id);
  }, [scheduledNotification, removeScheduledNotification]);

  const handleLongPressArticle = () => {
    openArticleMenu();
  };

  const handleNewNotificationPress = () => {
    closeSwipeMenu();
    navigation.navigate('NewNotification', {
      article,
    });
  };

  useImperativeHandle<SwipeRow<any> | null, SwipeRow<any> | null>(ref, () => rootRef.current);

  const closeSwipeMenu = () => {
    if (rootRef.current) {
      rootRef.current.closeRow();
    }
  };

  const handleMenuButtonPress = () => {
    closeSwipeMenu();
    openArticleMenu();
  };
  return (
    <>
      <SwipeRow
        ref={rootRef}
        setScrollEnabled={setScrollEnabled}
        rightOpenValue={-1 * ((64 * 3) + (16 * 2) + 1)}
        disableRightSwipe
        swipeGestureBegan={onSwipeMenuOpen}
      >
        <SwipeMenu>
          <SwipeMenuButtons>
            <SwipeMenuButton
              onPress={handleRemoveButtonPress}
              variant={ButtonVariant.DefaultText}
              size={ButtonSize.Large}
            >
              <ListBehindViewIcon name="trash" />
            </SwipeMenuButton>

            {isSetNotification ? (
              <SwipeMenuButton
                onPress={handleCancelNotificationButtonPress}
                variant={ButtonVariant.DefaultText}
                size={ButtonSize.Large}
              >
                <ListBehindViewIcon name="bell-off" />
              </SwipeMenuButton>
            ) : (
              <SwipeMenuButton
                onPress={handleNewNotificationPress}
                variant={ButtonVariant.DefaultText}
                size={ButtonSize.Large}
              >
                <ListBehindViewIcon name="bell" />
              </SwipeMenuButton>
            )}

            <SwipeMenuButton
              onPress={handleMenuButtonPress}
              variant={ButtonVariant.DefaultText}
              size={ButtonSize.Large}
            >
              <ListBehindViewIcon name="more-horizontal" />
            </SwipeMenuButton>
          </SwipeMenuButtons>
        </SwipeMenu>
        <ArticleCardWrapper>
          {isMainCard ? (
            <ArticleCard
              article={article}
              timeLeft={timeLeft}
              isSetNotification={isSetNotification}
              onPress={onPress}
              onLongPress={handleLongPressArticle}
            />
          ) : (
            <ArticleListCard
              article={article}
              timeLeft={timeLeft}
              isSetNotification={isSetNotification}
              onPress={onPress}
              onLongPress={handleLongPressArticle}
            />
          )}
        </ArticleCardWrapper>
      </SwipeRow>

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

      <BottomModal
        isVisible={visibleArticleMenu}
        onClose={closeArticleMenu}
      >
        <ArticleMenu
          article={article}
          onClose={closeArticleMenu}
        />
      </BottomModal>
    </>
  );
});

ListItem.displayName = 'ListItem';

const ArticleCardWrapper = styled.View`
  background-color: ${(props) => props.theme.colors.background};
`;

const SwipeMenu = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const SwipeMenuButtons = styled.View`
  padding: 0 16px;
  flex-direction: row;
  border-left-width: 1px;
  border-left-color: ${(props) => props.theme.colors.border};
`;

const SwipeMenuButton = styled(Button)`
  width: 64px;
`;

const ListBehindViewIcon = styled(Icon)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.title};
`;

export default ListItem;
