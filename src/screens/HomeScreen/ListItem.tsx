import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, {
  forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState,
} from 'react';
import { Dimensions, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
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
    notificationTagType,
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
  const animatableViewRef = useRef<Animatable.View & View>(null);

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

  const handleRemoveArticle = async () => {
    closeRemoveAlert();

    if (isMainCard) {
      await (animatableViewRef.current as any).animate({
        0: {
          translateX: 0,
        },
        1: {
          translateX: Dimensions.get('window').width * -1,
        },
      }, 300);
    } else {
      await (animatableViewRef.current as any).animate({
        0: {
          translateX: 0,
        },
        0.5: {
          translateX: Dimensions.get('window').width * -1,
          height: 96,
        },
        1: {
          translateX: Dimensions.get('window').width * -1,
          height: 0,
        },
      }, 600);
    }

    await removeArticle(article);

    if (isMainCard) {
      await (animatableViewRef.current as any).animate({
        0: {
          translateX: Dimensions.get('window').width,
        },
        1: {
          translateX: 0,
        },
      }, 300);
    }
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
      <Animatable.View ref={animatableViewRef}>
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

              {(isSetNotification && notificationTagType === 'default') ? (
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
                notificationTagType={notificationTagType}
                onPress={onPress}
                onLongPress={handleLongPressArticle}
              />
            ) : (
              <ArticleListCard
                article={article}
                timeLeft={timeLeft}
                isSetNotification={isSetNotification}
                notificationTagType={notificationTagType}
                onPress={onPress}
                onLongPress={handleLongPressArticle}
              />
            )}
          </ArticleCardWrapper>
        </SwipeRow>
      </Animatable.View>

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
          onRemove={() => handleRemoveArticle()}
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
  color: ${(props) => props.theme.colors.typography.primary};
`;

export default ListItem;
