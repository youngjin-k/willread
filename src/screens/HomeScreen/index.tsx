import {
  RouteProp, useNavigation, useRoute, useScrollToTop,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControl, ScrollView, StyleSheet, useColorScheme, View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ShareMenu from 'react-native-share-menu';
import styled, { css } from 'styled-components/native';

import willreadDark from '../../../assets/willread-dark.png';
import willreadLight from '../../../assets/willread-light.png';
import Line from '../../components/Line';
import { RootStackParamList, TabParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import useArticle, { DisplayItem } from '../../features/article/useArticle';
import useTheme from '../../lib/styles/useTheme';
import extractUrl from '../../lib/utils/extractUrl';
import webBrowser from '../../lib/utils/webBrowser';
import AddFromClipboard from './AddFromClipboard';
import ListItem from './ListItem';
import PendingList from './PendingList';
import PendingListAlert from './PendingListAlert';
import SpaceIndicator from './SpaceIndicator';

export interface SharedItem {
  mimeType: string;
  data: string;
}

function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const scheme = useColorScheme();
  const {
    articles,
    readArticle,
    scheduledNotifications,
    getDisplayItems,
  } = useArticle();
  const route = useRoute<RouteProp<TabParamList, 'Home'>>();
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>();
  const [displayMainItem, setDisplayMainItem] = useState<DisplayItem>();
  const [scrollEnable, setScrollEnabled] = useState(true);
  const rowRefs = useRef<any>([]);
  const swipeMenuOpenRowIndex = useRef<number | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const theme = useTheme();
  const [visiblePendingList, setVisiblePendingList] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useScrollToTop(scrollViewRef);

  useEffect(() => {
    if (route.params?.setScrollBottom && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd();
    }

    if (route.params?.setScrollTop && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }

    if (route.params?.openPendingList) {
      setTimeout(openPendingList, 300);
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
        rowRef.closeRow();
      }
    }
    swipeMenuOpenRowIndex.current = index;
  };

  const closeOpenedSwipeMenu = () => {
    handleSwipeMenuOpen(null);
  };

  const handleScrollView = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsScrolled(event.nativeEvent.contentOffset.y > 0);
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
  }, [getDisplayItems]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
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

  const openPendingList = () => {
    setVisiblePendingList(true);
  };

  const closePendingList = () => {
    setVisiblePendingList(false);
  };

  const handlePendingListAlertPress = () => {
    openPendingList();
  };

  const handlePendingListClose = () => {
    closePendingList();
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
    <>
      <Container>
        <Header isScrolled={isScrolled}>
          <FastImage
            style={{ height: 32, width: 170 }}
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

        <HomeScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 8 }}
          scrollEnabled={scrollEnable}
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
          <PendingListAlert onPress={handlePendingListAlertPress} />

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

      <PendingList
        isVisible={visiblePendingList}
        onClose={handlePendingListClose}
      />
    </>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const HomeScrollView = styled.ScrollView``;

const Header = styled.View<{isScrolled: boolean}>`
  background-color: ${(props) => props.theme.colors.background};
  padding: 16px 16px 8px 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  border-bottom-color: ${(props) => props.theme.colors.background};

  ${(props) => props.isScrolled && css`
    border-bottom-color: ${props.theme.colors.border};
  `}
`;

export default HomeScreen;
