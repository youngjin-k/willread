import React from 'react';
import styled from 'styled-components/native';
import { Platform } from 'react-native';
import ArticleListCard from '../../components/articleCard/ArticleListCard';
import { Article } from '../../features/article/articles';
import webBrowser from '../../lib/utils/webBrowser';

const ARTICLE_LIST: Article[] = [{
  id: '',
  url: 'https://www.willread.app/blog/welcome?webview=true',
  title: '윌리드에 오신걸 환영해요.',
  image: 'https://www.willread.app/assets/posts/welcome/main.png',
  createdAt: '',
  expiredAt: '',
}, {
  id: '',
  url: `https://www.willread.app/blog/how-to-save-to-willread${Platform.OS === 'ios' ? '-on-iphone' : ''}?webview=true`,
  title: '새 아티클은 어떻게 등록하나요?',
  image: `https://www.willread.app/assets/posts/how-to-save-to-willread${Platform.OS === 'ios' ? '-on-iphone' : ''}/main.png`,
  createdAt: '',
  expiredAt: '',
}];

function RecommendedArticles() {
  const openBrowser = (url: string) => {
    webBrowser.open(url);
  };

  return (
    <RecommendedArticlesBlock>
      <Title>추천 아티클</Title>
      {ARTICLE_LIST.map((article) => (
        <ArticleListCard
          key={article.url}
          article={article}
          onPress={() => openBrowser(article.url)}
        />
      ))}
    </RecommendedArticlesBlock>
  );
}

const RecommendedArticlesBlock = styled.View`
  
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.typography.point};
  margin: 16px 0 16px 16px;
`;

export default RecommendedArticles;
