import { RouteProp, useRoute } from '@react-navigation/native';
// import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import {
  Image, ScrollView, useColorScheme, View,
} from 'react-native';
import styled from 'styled-components/native';
// import * as WebBrowser from 'expo-web-browser';

import willreadDark from '../../../assets/willread-dark.png';
import willreadLight from '../../../assets/willread-light.png';
import ArticleCard from '../../components/articleCard/ArticleCard';
import ArticleListCard from '../../components/articleCard/ArticleListCard';
import { TabParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import BottomModal from '../../components/BottomModal';
import ArticleMenu from './ArticleMenu';
import useArticle from '../../features/article/useArticle';
import Line from '../../components/Line';

const recommendItem: Article = {
  id: '',
  uri: 'https://meetup.toast.com/posts/242',
  image:
    'https://image.toast.com/aaaadh/real/2020/repimg/main(18)_thumbnail.png',
  title: '라이트하우스 6.0에서 바뀐 성능 지표변화',
};

function HomeScreen(): React.ReactElement {
  const scrollViewRef = useRef<ScrollView>();
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
    // const subscription = Notifications.addNotificationResponseReceivedListener(
    //   async (response) => {
    //     const { article } = response.notification.request.content.data as {article: Article};

    //     if (article) {
    //       await WebBrowser.openBrowserAsync(article.uri, {
    //         enableBarCollapsing: true,
    //       });
    //     }
    //   },
    // );
    // return () => subscription.remove();
  }, []);

  const handlePressArticle = async (article: Article) => {
    // await WebBrowser.openBrowserAsync(article.uri, {
    //   enableBarCollapsing: true,
    // });
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
        ) : <></>}
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
  padding: 32px 16px;
`;

export default HomeScreen;
