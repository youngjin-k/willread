import React, { ReactElement } from 'react';
import styled from 'styled-components/native';

import { Article } from '../../features/article/articles';
import { DisplayItem } from '../../screens/HomeScreen';
import ArticleCardDescription from './ArticleCardDescription';
import ArticleThumbnail from './ArticleThumbnail';
import NotificationTag from './NotificationTag';
import PressableWrapper from './PressableWrapper';

export interface ArticleListCardProps extends DisplayItem {
  onPress?: (article: Article) => void;
  onLongPress?: (article: Article) => void;
}

function ArticleListCard({
  article,
  timeLeft,
  isSetNotification = false,
  notificationTagType,
  onPress,
  onLongPress,
}: ArticleListCardProps): ReactElement {
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
    url, title, image, lastReadAt,
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
            read={!!lastReadAt}
          >
            {title}
          </Title>
          <ArticleCardDescription
            url={url}
            timeLeft={timeLeft}
          />
        </Content>
        <ThumbnailWrapper>
          <ArticleThumbnail uri={image} />
          <NotificationTag
            visible={isSetNotification}
            type={notificationTagType}
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
