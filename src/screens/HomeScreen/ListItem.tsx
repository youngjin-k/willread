import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, {
  forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState,
} from 'react';
import { useWindowDimensions, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/Feather';
import styled from '@emotion/native';

import ArticleCard from '../../components/articleCard/ArticleCard';
import ArticleListCard from '../../components/articleCard/ArticleListCard';
import BottomModal from '../../components/BottomModal';
import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import { RootStackParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import useArticle, { DisplayItem } from '../../features/article/useArticle';
import ArticleMenu from './ArticleMenu';
import CancelNotificationConfirm from './CancelNotificationConfirm';
import RemoveConfirm from './RemoveConfirm';

export interface ListItemProps {
  item: DisplayItem;
  onPress: (article: Article) => void;
  onSwipeMenuOpen: () => void;
  isMainCard?: boolean;
}

const ListItem = forwardRef<Swipeable, ListItemProps>(({
  item: {
    article,
    timeLeft,
    isSetNotification,
    notificationTagType,
  },
  onPress,
  onSwipeMenuOpen,
  isMainCard = false,
}, ref) => {
  const rootRef = useRef<Swipeable>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [visibleArticleMenu, setVisibleArticleMenu] = useState(false);
  const [visibleRemoveAlert, setVisibleRemoveAlert] = useState(false);
  const [visiblCancelNotificationAlert, setVisibleCancelNotificationAlert] = useState(false);
  const { removeArticle, scheduledNotifications, removeScheduledNotification } = useArticle();
  const animatableViewRef = useRef<Animatable.View & View>(null);
  const window = useWindowDimensions();

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
          translateX: window.width * -1,
        },
      }, 300);
    } else {
      await (animatableViewRef.current as any).animate({
        0: {
          translateX: 0,
        },
        0.5: {
          translateX: window.width * -1,
          height: 96,
        },
        1: {
          translateX: window.width * -1,
          height: 0,
        },
      }, 600);
    }

    await removeArticle(article);

    if (isMainCard) {
      await (animatableViewRef.current as any).animate({
        0: {
          translateX: window.width,
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
    setTimeout(() => {
      removeScheduledNotification(scheduledNotification.id);
    }, 200);
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

  useImperativeHandle<Swipeable | null, Swipeable | null>(ref, () => rootRef.current);

  const closeSwipeMenu = () => {
    if (rootRef.current) {
      rootRef.current.close();
    }
  };

  const handleMenuButtonPress = () => {
    closeSwipeMenu();
    openArticleMenu();
  };
  return (
    <>
      <Animatable.View ref={animatableViewRef}>
        <Swipeable
          ref={rootRef}
          onSwipeableRightWillOpen={onSwipeMenuOpen}
          rightThreshold={40}
          renderRightActions={() => (
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
          )}
        >
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
        </Swipeable>
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
  width: ${64 * 3 + 16}px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

const SwipeMenuButtons = styled.View`
  padding: 0 16px 0 0;
  flex-direction: row;
`;

const SwipeMenuButton = styled(Button)`
  width: 64px;
`;

const ListBehindViewIcon = styled(Icon)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.primary};
`;

export default ListItem;
