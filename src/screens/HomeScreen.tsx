import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Image, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

import willreadDark from '../../assets/willread-dark.png';
import willreadLight from '../../assets/willread-light.png';
import ArticleListCard from '../components/articleCard/ArticleListCard';
import ArticleCard from '../components/articleCard/ArticleCard';
import CategoryFilter from '../components/CategoryFilter';
import { RootStackParamList } from '../config/Navigation';
import { Article } from '../features/article/articles';
import { CategoryColors } from '../features/homeCategoryFilters';
import { RootState } from '../features/store';

const recommendItem: Article = {
  id: '',
  uri: 'https://meetup.toast.com/posts/242',
  image:
    'https://image.toast.com/aaaadh/real/2020/repimg/main(18)_thumbnail.png',
  title: '라이트하우스 6.0에서 바뀐 성능 지표변화',
  minutesToRead: 5,
  categoryColor: CategoryColors.RED,
};

function HomeScreen(): React.ReactElement {
  const scheme = useColorScheme();
  const { articles } = useSelector((state: RootState) => state.articles);
  const { filters } = useSelector(
    (state: RootState) => state.homeCategoryFilters,
  );
  const [displayArticles, setDisplayArticles] = useState<Article[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { article } = response.notification.request.content.data;
        console.log(article);

        if (article) {
          navigation.navigate('Viewer', {
            item: article,
          });
        }
      },
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (filters.category === CategoryColors.DEFAULT) {
      setDisplayArticles(articles);
      return;
    }
    setDisplayArticles(
      articles.filter((article) => article.categoryColor === filters.category),
    );
  }, [articles, filters]);

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <Image
            style={{ width: 160 }}
            resizeMode="contain"
            source={scheme === 'dark' ? willreadDark : willreadLight}
          />
        </Header>
        <ArticleCard item={recommendItem} />
        <CategoryFilter />
        {displayArticles
          && displayArticles.map((item) => (
            <ArticleListCard key={item.id} item={item} />
          ))}
      </ScrollView>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const ScrollView = styled.ScrollView`
  flex: 1;
`;

const Header = styled.View`
  padding: 32px 16px;
`;

export default HomeScreen;
