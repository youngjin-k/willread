import {
  RouteProp,
  useNavigation,
  useRoute,
  useScrollToTop,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
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
import ArticleCard from '../../components/articleCard/ArticleCard';
import ArticleListCard from '../../components/articleCard/ArticleListCard';
import calculateTimeLeft from '../../components/articleCard/calculateTimeLeft';
import BottomModal from '../../components/BottomModal';
import Line from '../../components/Line';
import { RootStackParamList, TabParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import useArticle from '../../features/article/useArticle';
import AddFromClipboard from './AddFromClipboard';
import ArticleMenu from './ArticleMenu';

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
}

function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const scheme = useColorScheme();
  const { articles, setRead } = useArticle();
  const [selectedArticle, setSelectedArticle] = useState<Article>();
  const route = useRoute<RouteProp<TabParamList, 'Home'>>();
  const [displayItems, setDisplayItems] = useState<DisplayItem[]>();
  const [displayMainItem, setDisplayMainItem] = useState<DisplayItem>();

  const visibleArticleMenu = !!selectedArticle;

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

      const items: DisplayItem[] = articles.map((article) => ({
        article,
        timeLeft: calculateTimeLeft(article.createdAt),
      }));

      // if (items.some((item) => item.timeLeft.day < 1)) {
      setDisplayMainItem(items.shift());
      // }

      setDisplayItems(items);
    };

    updater();
    const timer = setInterval(updater, 1000 * 60);

    return () => {
      clearInterval(timer);
    };
  }, [articles]);

  const handlePressArticle = (article: Article) => {
    readArticle(article);
  };

  const readArticle = useCallback(
    async (article: Article) => {
      setRead(article);
      if (await InAppBrowser.isAvailable()) {
        await InAppBrowser.open(article.url, {
          // iOS Properties
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'fullScreen',
          modalTransitionStyle: 'coverVertical',
          modalEnabled: false,
          enableBarCollapsing: true,

          // Android Properties
          showTitle: true,
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
        });
      } else {
        Linking.openURL(article.url);
      }

      setSelectedArticle({ ...article, read: true });
    },
    [setRead],
  );

  const handleLongPressArticle = (article: Article) => {
    setSelectedArticle(article);
  };

  const closeArticleMenu = () => {
    setSelectedArticle(undefined);
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

  return (
    <Container>
      <HomeScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        <Header>
          <Image
            style={{ width: 160 }}
            resizeMode="contain"
            source={scheme === 'dark' ? willreadDark : willreadLight}
          />
        </Header>

        {displayMainItem && (
          <>
            <ArticleCard
              article={displayMainItem.article}
              timeLeft={displayMainItem.timeLeft}
              onPress={handlePressArticle}
              onLongPress={handleLongPressArticle}
            />

            <View style={{ paddingVertical: 16 }}>
              <Line />
            </View>
          </>
        )}

        <AddFromClipboard />

        {displayItems
          && displayItems.map(({ article, timeLeft }) => (
            <ArticleListCard
              key={article.id}
              article={article}
              timeLeft={timeLeft}
              onPress={handlePressArticle}
              onLongPress={handleLongPressArticle}
            />
          ))}
      </HomeScrollView>

      <BottomModal
        isVisible={visibleArticleMenu}
        onClose={closeArticleMenu}
      >
        {selectedArticle ? (
          <ArticleMenu
            article={selectedArticle}
            onClose={closeArticleMenu}
          />
        ) : (
          <></>
        )}
      </BottomModal>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const HomeScrollView = styled.ScrollView`
  flex: 1;
`;

const Header = styled.View`
  padding: 32px 16px 16px 16px;
`;

export default HomeScreen;
