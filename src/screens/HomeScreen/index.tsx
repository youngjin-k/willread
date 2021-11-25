import {
  RouteProp, useNavigation, useRoute, useScrollToTop,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import ShareMenu from 'react-native-share-menu';
import SplashScreen from 'react-native-splash-screen';
import styled from 'styled-components/native';

import Line from '../../components/Line';
import { RootStackParamList, TabParamList } from '../../config/Navigation';
import { Article, NotificationType } from '../../features/article/articles';
import useArticle, { DisplayItem } from '../../features/article/useArticle';
import useTheme from '../../lib/styles/useTheme';
import extractUrl from '../../lib/utils/extractUrl';
import webBrowser from '../../lib/utils/webBrowser';
import willreadToast from '../../lib/willreadToast';
import ClipboardContentAlert, { ClipboardContentAlertHandle } from './ClipboardContentAlert';
import EmptyArticleList from './EmptyArticleList';
import ExpiryDateArticleModal from './ExpiryDateArticleModal';
import ListItem from './ListItem';
import RecommendedArticles from './RecommendedArticles';

export interface SharedItem {
  mimeType: string;
  data: string;
}

function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & TabParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const ClipboardContentAlertRef = useRef<ClipboardContentAlertHandle>(null);
  const {
    articles,
    readArticle,
    scheduledNotifications,
    getDisplayItems,
    getArticleById,
  } = useArticle();
  const route = useRoute<RouteProp<TabParamList, 'Home'>>();
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>();
  const [displayMainItem, setDisplayMainItem] = useState<DisplayItem>();
  const rowRefs = useRef<Swipeable[] | null[]>([]);
  const swipeMenuOpenRowIndex = useRef<number | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isVisibleExpiryDateArticleModal, setIsVisibleExpiryDateArticleModal] = useState(false);
  const [expiryDateArticle, setExpiryDateArticle] = useState<Article>();

  useScrollToTop(scrollViewRef);

  useEffect(() => {
    if (route.params?.setScrollBottom && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd();
    }

    if (route.params?.setScrollTop && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }

    if (route.params?.expiryDateArticleModal) {
      setIsVisibleExpiryDateArticleModal(true);
      setExpiryDateArticle(route.params?.expiryDateArticleModal.article);
    }
  }, [navigation, route]);

  const handleShare = useCallback(
    (item?: SharedItem) => {
      if (!item) {
        return;
      }

      webBrowser.close();

      const url = extractUrl(item.data);

      if (!url) {
        return;
      }

      navigation.navigate('NewArticle', {
        url,
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
        rowRef.close();
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

  const updateDisplayItems = useCallback(() => {
    const items = getDisplayItems();
    setDisplayMainItem(items.shift());
    setDisplayItems(items);
    setIsLoading(false);
  }, [getDisplayItems]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);

    setTimeout(() => {
      ClipboardContentAlertRef.current?.syncClipboardText();
      updateDisplayItems();
      setRefreshing(false);
    }, 1000);
  }, [updateDisplayItems]);

  useEffect(() => {
    updateDisplayItems();
    const timer = setInterval(updateDisplayItems, 1000 * 60);

    return () => {
      clearInterval(timer);
    };
  }, [articles, scheduledNotifications, updateDisplayItems]);

  const handlePressArticle = (article: Article) => {
    readArticle(article);
  };

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const { article: { id }, type } = response.notification.request.content.data as {
          article: Article;
          type?: NotificationType;
        };

        webBrowser.close();

        const article = getArticleById(id);

        if (!article) {
          willreadToast.showSimple('이미 삭제 된 아티클이에요.');
          return;
        }

        if (type === 'EXPIRE_ARTICLE') {
          navigation.navigate('Home', {
            expiryDateArticleModal: {
              article,
            },
          });
          return;
        }

        readArticle(article);
      },
    );
    return () => subscription.remove();
  }, [getArticleById, navigation, readArticle]);

  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, articles.length);
  }, [articles]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    setTimeout(() => {
      SplashScreen.hide();
    }, 500);
  }, [isLoading]);

  const total = (displayItems ? displayItems.length : 0) + (displayMainItem ? 1 : 0);

  return (
    <>
      <Container>
        <HomeScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 8 }}
          onScroll={handleScrollView}
          scrollEventThrottle={16}
          refreshControl={(
            <RefreshControl
              onRefresh={handleRefresh}
              refreshing={refreshing}
              tintColor={theme.colors.typography.point}
              colors={[theme.colors.typography.point]}
              progressBackgroundColor={theme.colors.backgroundElevated}
            />
          )}
        >
          {total === 0 && <EmptyArticleList />}

          {displayMainItem && (
            <>
              <ListItem
                ref={(el) => {
                  rowRefs.current[0] = el;
                }}
                item={displayMainItem}
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

          <ClipboardContentAlert ref={ClipboardContentAlertRef} />

          {displayItems
            && displayItems.map((item, i) => (
              <ListItem
                ref={(el) => {
                  rowRefs.current[i + 1] = el;
                }}
                key={item.article.id}
                item={item}
                onPress={handlePressArticle}
                onSwipeMenuOpen={() => {
                  handleSwipeMenuOpen(i + 1);
                }}
              />
            ))}

          {total === 0 && <RecommendedArticles />}
        </HomeScrollView>
      </Container>

      {expiryDateArticle && (
        <ExpiryDateArticleModal
          isVisible={isVisibleExpiryDateArticleModal}
          onClose={() => {
            setIsVisibleExpiryDateArticleModal(false);
          }}
          article={expiryDateArticle}
        />
      )}
    </>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const HomeScrollView = styled.ScrollView``;

export default HomeScreen;
