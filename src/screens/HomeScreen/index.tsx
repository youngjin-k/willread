import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useRef, useState } from 'react';
import { Image, ScrollView, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

import willreadDark from '../../../assets/willread-dark.png';
import willreadLight from '../../../assets/willread-light.png';
import ArticleCard from '../../components/articleCard/ArticleCard';
import ArticleListCard from '../../components/articleCard/ArticleListCard';
import CategoryFilter from '../../components/CategoryFilter';
import { RootStackParamList, TabParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import { CategoryColors } from '../../features/homeCategoryFilters';
import { RootState } from '../../features/store';
import BottomModal from '../BottomModal';
import ArticleMenu from './ArticleMenu';

const recommendItem: Article = {
  id: '',
  uri: 'https://meetup.toast.com/posts/242',
  image:
    'https://image.toast.com/aaaadh/real/2020/repimg/main(18)_thumbnail.png',
  title: '라이트하우스 6.0에서 바뀐 성능 지표변화',
  categoryColor: CategoryColors.RED,
};

function HomeScreen(): React.ReactElement {
  const scrollViewRef = useRef<ScrollView>();
  const scheme = useColorScheme();
  const { articles } = useSelector((state: RootState) => state.articles);
  const { filters } = useSelector(
    (state: RootState) => state.homeCategoryFilters,
  );
  const [displayArticles, setDisplayArticles] = useState<Article[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
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
      (response) => {
        const { article } = response.notification.request.content.data;

        if (article) {
          navigation.navigate('Viewer', {
            article: article as Article,
          });
        }
      },
    );
    return () => subscription.remove();
  }, [navigation]);

  useEffect(() => {
    if (filters.category === CategoryColors.DEFAULT) {
      setDisplayArticles(articles);
      return;
    }
    setDisplayArticles(
      articles.filter((article) => article.categoryColor === filters.category),
    );
  }, [articles, filters]);

  const handlePressArticle = (article: Article) => {
    navigation.navigate('Viewer', {
      article,
    });
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
        <CategoryFilter />
        {displayArticles
          && displayArticles.map((article) => (
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
          <ArticleMenu article={selectedArticle} onClose={closeArticleMenu} />
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
