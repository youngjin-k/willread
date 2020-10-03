import React, { ReactElement } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { ColorSchemeName, useColorScheme } from 'react-native-appearance';
import styled, { css } from 'styled-components/native';

import { Article } from '../../features/article/articles';
import CategoryBar from '../CategoryBar';
import ArticleCardDescription from './ArticleCardDescription';

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
    uri, title, image, minutesToRead, categoryColor,
  } = article;

  return (
    <TouchableWithoutFeedback
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <ArticleListCardBlock>
        <ThumbnailWrapper>
          <Thumbnail
            source={{
              uri: image,
            }}
            scheme={scheme}
          />
        </ThumbnailWrapper>
        <Content>
          <CategoryBar categoryColor={categoryColor} />
          <Title numberOfLines={2}>{title}</Title>
          <ArticleCardDescription uri={uri} minutesToRead={minutesToRead} />
        </Content>
      </ArticleListCardBlock>
    </TouchableWithoutFeedback>
  );
}

const ArticleListCardBlock = styled.View`
  padding: 8px 16px;
  flex-direction: row;
`;

const ThumbnailWrapper = styled.View`
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.secondary};
`;

const Thumbnail = styled.Image<{ scheme: ColorSchemeName }>`
  width: 96px;
  height: 96px;
  border-radius: 16px;

  ${(props) => props.scheme === 'dark'
    && css`
      opacity: 0.8;
    `}
`;

const Content = styled.View`
  flex: 1;
  padding-left: 16px;
`;

const Title = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.title};
  font-weight: bold;
`;

export default ArticleListCard;