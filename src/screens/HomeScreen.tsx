import React, { useEffect, useState } from 'react';
import { Image, useColorScheme } from 'react-native';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';
import willreadLight from '../../assets/willread-light.png';
import willreadDark from '../../assets/willread-dark.png';
import RecommendCard, { Article } from '../components/RecommendCard';
import WillreadCard from '../components/WillreadCard';
import CategoryFilter from '../components/CategoryFilter';
import { CategoryColors } from '../features/homeCategoryFilters';
import { RootState } from '../features/store';

const recommendItem: Article = {
  id: '',
  uri: 'https://meetup.toast.com/posts/242',
  imageUri: 'https://image.toast.com/aaaadh/real/2020/repimg/main(18)_thumbnail.png',
  title: '라이트하우스 6.0에서 바뀐 성능 지표변화',
  minutesToRead: 5,
  categoryColor: CategoryColors.RED,
};

function HomeScreen(): React.ReactElement {
  const scheme = useColorScheme();
  const { articles } = useSelector((state: RootState) => state.articles);
  const { filters } = useSelector((state: RootState) => state.homeCategoryFilters);
  const [displayArticles, setDisplayArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (filters.category === CategoryColors.DEFAULT) {
      setDisplayArticles(articles);
      return;
    }
    setDisplayArticles(articles.filter((article) => article.categoryColor === filters.category));
  }, [articles, filters]);

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Header>
          <Image style={{ width: 160 }} resizeMode="contain" source={scheme === 'dark' ? willreadDark : willreadLight} />
        </Header>
        <RecommendCard item={recommendItem} />
        <CategoryFilter />
        {displayArticles.map((item) => <WillreadCard key={item.id} item={item} />)}
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
