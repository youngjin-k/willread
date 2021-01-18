import {
  RouteProp,
  useNavigation,
  useRoute,
  useScrollToTop,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  Image, Linking, ScrollView, useColorScheme, View,
} from 'react-native';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';
import ShareMenu from 'react-native-share-menu';
import styled from 'styled-components/native';

import willreadDark from '../../../assets/willread-dark.png';
import willreadLight from '../../../assets/willread-light.png';
import calculateTimeLeft from '../../components/articleCard/calculateTimeLeft';
import Line from '../../components/Line';
import { RootStackParamList, TabParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import useArticle from '../../features/article/useArticle';
import AddFromClipboard from './AddFromClipboard';
import ListItem from './ListItem';
import SpaceIndicator from './SpaceIndicator';

export interface SharedItem {
  mimeType: string;
  data: string;
}

export interface ArticleTimeLeft {
  second: number;
  day: number;
  hour: number;
  minute: number;
  label: string;
  detailLabel: string;
}

export interface DisplayItem {
  article: Article;
  timeLeft: ArticleTimeLeft;
  isSetNotification: boolean;
  notificationTagType: 'default' | 'accent';
}

function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const scheme = useColorScheme();
  const { articles, readArticle, scheduledNotifications } = useArticle();
  const route = useRoute<RouteProp<TabParamList, 'Home'>>();
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>();
  const [displayMainItem, setDisplayMainItem] = useState<DisplayItem>();
  const [scrollEnable, setScrollEnabled] = useState(true);
  const rowRefs = useRef<any>([]);
  const swipeMenuOpenRowIndex = useRef<number | null>(null);

  useScrollToTop(scrollViewRef);

  useEffect(() => {
    if (route?.params?.setScrollBottom && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd();
    }
  }, [route]);

  const handleShare = useCallback(
    (item?: SharedItem) => {
      if (!item) {
        return;
      }

      const { data } = item;

      navigation.navigate('NewArticle', {
        url: data,
      });
    },
    [navigation],
  );

  const handleSwipeMenuOpen = (index: number | null) => {
    if (
      swipeMenuOpenRowIndex.current !== null
      && swipeMenuOpenRowIndex.current !== index
    ) {
      const rowRef = rowRefs.current[swipeMenuOpenRowIndex.current];
      if (rowRef) {
        rowRef.closeRow();
      }
    }
    swipeMenuOpenRowIndex.current = index;
  };

  const closeOpenedSwipeMenu = () => {
    handleSwipeMenuOpen(null);
  };

  const handleScrollView = () => {
    if (swipeMenuOpenRowIndex.current !== null) {
      closeOpenedSwipeMenu();
    }
  };

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, [handleShare]);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, [handleShare]);

  useEffect(() => {
    const updater = () => {
      if (articles.length < 1) {
        setDisplayMainItem(undefined);
        setDisplayItems(undefined);
        return;
      }

      let badgeCount = 0;

      const items: DisplayItem[] = articles.map((article) => {
        const scheduledNotification = scheduledNotifications.find(
          (notification) => notification.articleId === article.id,
        );

        let isSetNotification = false;
        let notificationTagType: DisplayItem['notificationTagType'] = 'default';

        if (scheduledNotification) {
          isSetNotification = true;
          const now = dayjs();

          if (dayjs(scheduledNotification.date).isBefore(now)) {
            notificationTagType = 'accent';
            badgeCount += 1;
          }
        }

        return {
          article,
          timeLeft: calculateTimeLeft(article.createdAt),
          isSetNotification,
          notificationTagType,
        };
      });

      setDisplayMainItem(items.shift());
      setDisplayItems(items);
      Notifications.setBadgeCountAsync(badgeCount);
    };

    updater();
    const timer = setInterval(updater, 1000 * 30);

    return () => {
      clearInterval(timer);
    };
  }, [articles, scheduledNotifications]);

  const handlePressArticle = (article: Article) => {
    readArticle(article);
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const { article } = response.notification.request.content.data as {
          article: Article;
        };
        if (article) {
          readArticle(article);
        }
      },
    );
    return () => subscription.remove();
  }, [readArticle]);

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, articles.length);
  }, [articles]);

  return (
    <Container>
      <HomeScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
        scrollEnabled={scrollEnable}
        onScroll={handleScrollView}
        scrollEventThrottle={1000}
      >
        <Header>
          <Image
            style={{ width: 160 }}
            resizeMode="contain"
            source={scheme === 'dark' ? willreadDark : willreadLight}
          />
          <SpaceIndicator
            usage={
              // TODO 정리 필요
              (displayItems ? displayItems.length : 0)
              + (displayMainItem ? 1 : 0)
            }
          />
        </Header>

        {displayMainItem && (
          <>
            <ListItem
              ref={(el) => {
                rowRefs.current[0] = el;
              }}
              item={displayMainItem}
              setScrollEnabled={setScrollEnabled}
              onPress={handlePressArticle}
              onSwipeMenuOpen={() => {
                handleSwipeMenuOpen(0);
              }}
              isMainCard
            />

            <View style={{ paddingTop: 16, paddingBottom: 8 }}>
              <Line />
            </View>
          </>
        )}

        <AddFromClipboard />

        {displayItems
          && displayItems.map((item, i) => (
            <ListItem
              ref={(el) => {
                rowRefs.current[i + 1] = el;
              }}
              key={item.article.id}
              item={item}
              setScrollEnabled={setScrollEnabled}
              onPress={handlePressArticle}
              onSwipeMenuOpen={() => {
                handleSwipeMenuOpen(i + 1);
              }}
            />
          ))}
      </HomeScrollView>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const HomeScrollView = styled.ScrollView``;

const Header = styled.View`
  padding: 32px 16px 16px 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export default HomeScreen;
