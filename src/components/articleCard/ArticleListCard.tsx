import React, { ReactElement } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import styled from '@emotion/native';

import { Article } from '../../features/article/articles';
import { DisplayItem } from '../../features/article/useArticle';
import ArticleCardDescription from './ArticleCardDescription';
import ArticleThumbnail from './ArticleThumbnail';
import NotificationTag from './NotificationTag';
import PressableWrapper from './PressableWrapper';

export interface ArticleListCardProps {
  article: DisplayItem['article'];
  timeLeft?: DisplayItem['timeLeft'];
  isSetNotification?: DisplayItem['isSetNotification'];
  notificationTagType?: DisplayItem['notificationTagType'];
  onPress?: (article: Article) => void;
  onLongPress?: (article: Article) => void;
  selected?: boolean;
}

function ArticleListCard({
  article,
  timeLeft,
  isSetNotification = false,
  notificationTagType,
  onPress,
  onLongPress,
  selected,
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
          {selected && (
          <SelectedIconWrapper>
            <CheckIcon name="check" />
          </SelectedIconWrapper>
          )}
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
  background-color: ${(props) => props.theme.colors.backgroundElevated};
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

const SelectedIconWrapper = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 16px;
  justify-content: center;
  align-items: center;
`;

const CheckIcon = styled(Icon)`
  font-size: 24px;
  color: ${(props) => props.theme.colors.typography.primary};
`;

export default ArticleListCard;
