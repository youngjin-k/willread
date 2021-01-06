import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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
import BottomModal from '../../components/BottomModal';
import Line from '../../components/Line';
import { RootStackParamList, TabParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import useArticle from '../../features/article/useArticle';
import AddFromClipboard from './AddFromClipboard';
import ArticleMenu from './ArticleMenu';

type SharedItem = {
  mimeType: string;
  data: string;
};

const recommendItem: Article = {
  id: '',
  url: 'https://meetup.toast.com/posts/242',
  image:
    'https://image.toast.com/aaaadh/real/2020/repimg/main(18)_thumbnail.png',
  title: '라이트하우스 6.0에서 바뀐 성능 지표변화',
};

function HomeScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const scrollViewRef = useRef<ScrollView>(null);
  const scheme = useColorScheme();
  const { articles } = useArticle();
  const [selectedArticle, setSelectedArticle] = useState<Article>();
  const route = useRoute<RouteProp<TabParamList, 'Home'>>();

  const visibleArticleMenu = !!selectedArticle;

  useEffect(() => {
    if (route?.params?.setScrollBottom && scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd();
    }
  }, [route]);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      async (response) => {
        const { article } = response.notification.request.content.data as {article: Article};
        if (article) {
          handlePressArticle(article);
        }
      },
    );
    return () => subscription.remove();
  }, []);

  const handleShare = useCallback((item?: SharedItem) => {
    if (!item) {
      return;
    }

    const { mimeType, data } = item;

    console.log(data);
    console.log(mimeType);

    navigation.navigate('NewArticle', {
      url: data,
    });
  }, []);

  useEffect(() => {
    ShareMenu.getInitialShare(handleShare);
  }, [handleShare]);

  useEffect(() => {
    const listener = ShareMenu.addNewShareListener(handleShare);

    return () => {
      listener.remove();
    };
  }, [handleShare]);

  const handlePressArticle = async (article: Article) => {
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
  };

  const handleLongPressArticle = (article: Article) => {
    setSelectedArticle(article);
  };

  const closeArticleMenu = () => {
    setSelectedArticle(undefined);
  };

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

        <ArticleCard
          article={recommendItem}
          onPress={handlePressArticle}
          onLongPress={handleLongPressArticle}
        />

        <View style={{ paddingVertical: 16 }}>
          <Line />
        </View>

        <AddFromClipboard />

        {articles
          && articles.map((article) => (
            <ArticleListCard
              key={article.id}
              article={article}
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
