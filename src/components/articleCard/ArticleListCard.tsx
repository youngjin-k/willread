import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { ReactElement } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { ColorSchemeName, useColorScheme } from 'react-native-appearance';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components/native';

import { RootStackParamList } from '../../config/Navigation';
import { Article, removeArticle } from '../../features/article/articles';
import CategoryBar from '../CategoryBar';
import ArticleCardDescription from './ArticleCardDescription';

export interface ArticleListCardProps {
  item: Article;
}

function ArticleListCard({ item }: ArticleListCardProps): ReactElement {
  const scheme = useColorScheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const handlePress = () => {
    navigation.navigate('Viewer', {
      item,
    });
  };

  const handleLongPress = () => {
    dispatch(removeArticle(item));
  };

  const {
    uri, title, image, minutesToRead, categoryColor,
  } = item;

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
