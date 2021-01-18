import React, { ReactElement } from 'react';
import { ColorSchemeName, useColorScheme } from 'react-native-appearance';
import styled, { css } from 'styled-components/native';

import { Article } from '../../features/article/articles';
import { DisplayItem } from '../../screens/HomeScreen';
import ArticleCardDescription from './ArticleCardDescription';
import NotificationTag from './NotificationTag';
import PressableWrapper from './PressableWrapper';

export interface ArticleCardProps extends DisplayItem {
  onPress?: (article: Article) => void;
  onLongPress?: (article: Article) => void;
}

function ArticleCard({
  article,
  timeLeft,
  isSetNotification,
  notificationTagType,
  onPress,
  onLongPress,
}: ArticleCardProps): ReactElement {
  const scheme = useColorScheme();

  const {
    url, title, image, lastReadAt,
  } = article;

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

  return (
    <>
      <ReccomendTitle>{timeLeft.detailLabel}</ReccomendTitle>
      <PressableWrapper
        onPress={handlePress}
        onLongPress={handleLongPress}
      >
        <RecommendCardBlock>
          <ThumbnailWrapper>
            <Thumbnail
              source={{
                uri: image,
              }}
              scheme={scheme}
            />
            <NotificationTag
              visible={isSetNotification}
              type={notificationTagType}
            />
          </ThumbnailWrapper>
          <Content>
            <Title
              numberOfLines={2}
              read={!!lastReadAt}
            >
              {title}
            </Title>
            <ArticleCardDescription url={url} />
          </Content>
        </RecommendCardBlock>
      </PressableWrapper>
    </>
  );
}

const RecommendCardBlock = styled.View`
  padding: 8px;
`;

const ReccomendTitle = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.point};
  margin: 0 0 4px 16px;
  font-weight: bold;
`;

const ThumbnailWrapper = styled.View`
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.secondary};
`;

const Content = styled.View`
  padding: 0 0 0 8px;
  margin: 16px 0 0 0;
`;

const Thumbnail = styled.Image<{ scheme: ColorSchemeName }>`
  width: 100%;
  aspect-ratio: ${1.9 / 1};
  border-radius: 16px;

  ${(props) => props.scheme === 'dark'
    && css`
      opacity: 0.8;
    `}
`;

const Title = styled.Text<{read: boolean}>`
  font-size: 18px;
  color: ${(props) => (props.read
    ? props.theme.colors.typography.secondary
    : props.theme.colors.typography.primary)};
  font-weight: bold;
`;

export default ArticleCard;
