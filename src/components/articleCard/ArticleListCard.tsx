import React, { ReactElement } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native-appearance';
import styled, { css } from 'styled-components/native';

import { Article } from '../../features/article/articles';
import { ArticleTimeLeft } from '../../screens/HomeScreen';
import ArticleCardDescription from './ArticleCardDescription';
import NotificationTag from './NotificationTag';
import PressableWrapper from './PressableWrapper';

export interface ArticleListCardProps {
  article: Article;
  timeLeft?: ArticleTimeLeft;
  isSetNotification?: boolean;
  onPress?: (article: Article) => void;
  onLongPress?: (article: Article) => void;
}

function ArticleListCard({
  article,
  timeLeft,
  isSetNotification = false,
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
    url, title, image, read,
  } = article;

  return (
    <PressableWrapper
      onPress={handlePress}
      onLongPress={handleLongPress}
      pressable={Boolean(onPress || onLongPress)}
    >
      <ArticleListCardBlock>
        <Content>
          <Title
            numberOfLines={2}
            read={read}
          >
            {title}
          </Title>
          <ArticleCardDescription
            url={url}
            timeLeft={timeLeft}
          />
        </Content>
        <ThumbnailWrapper>
          <Thumbnail
            source={{
              uri: image,
            }}
            scheme={scheme}
          />
          <NotificationTag visible={isSetNotification} />
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

const Title = styled.Text<{ read: boolean }>`
  font-size: 16px;
  color: ${(props) => (props.read
    ? props.theme.colors.typography.secondary
    : props.theme.colors.typography.primary)};
  font-weight: bold;
`;

export default ArticleListCard;
