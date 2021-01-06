import React, { ReactElement } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native-appearance';
import styled, { css } from 'styled-components/native';

import { Article } from '../../features/article/articles';
import ArticleCardDescription from './ArticleCardDescription';
import PressableWrapper from './PressableWrapper';

export interface ArticleListCardProps {
  article: Article;
  onPress?: (article: Article) => void;
  onLongPress?: (article: Article) => void;
}

function ArticleListCard({
  article,
  onPress,
  onLongPress,
}: ArticleListCardProps): ReactElement {
  const scheme = useColorScheme();

  const handlePress = () => {
    if (onPress) {
      onPress(article);
    }
  };

  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(article);
    }
  };

  const {
    url, title, image,
  } = article;

  return (
    <PressableWrapper
      onPress={handlePress}
      onLongPress={handleLongPress}
      pressable={Boolean(onPress || onLongPress)}
    >
      <ArticleListCardBlock>
        <Content>
          <Title numberOfLines={2}>{title}</Title>
          <ArticleCardDescription url={url} />
        </Content>
        <ThumbnailWrapper>
          <Thumbnail
            source={{
              uri: image,
            }}
            scheme={scheme}
          />
        </ThumbnailWrapper>
      </ArticleListCardBlock>
    </PressableWrapper>
  );
}

const ArticleListCardBlock = styled.View`
  padding: 8px;
  flex-direction: row;
`;

const ThumbnailWrapper = styled.View`
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.secondary};
`;

const Thumbnail = styled.Image<{ scheme: ColorSchemeName }>`
  width: 96px;
  height: 80px;
  border-radius: 16px;

  ${(props) => props.scheme === 'dark'
    && css`
      opacity: 0.8;
    `}
`;

const Content = styled.View`
  flex: 1;
  padding: 8px 16px 0 0;
`;

const Title = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.title};
  font-weight: 700;
`;

export default ArticleListCard;
