import React, { ReactElement } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import styled, { css } from 'styled-components/native';
import { useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CategoryColors } from '../../features/homeCategoryFilters';
import { RootStackParamList } from '../../config/Navigation';
import ArticleCardDescription from './ArticleCardDescription';
import CategoryBar from '../CategoryBar';
import { Article } from '../../features/article/articles';

export interface Category {
  color: CategoryColors;
  label?: string;
}

export interface ArticleCardProps {
  item: Article;
}

function ArticleCard({ item }: ArticleCardProps): ReactElement {
  const scheme = useColorScheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const {
    uri, title, image, minutesToRead, categoryColor,
  } = item;

  const handlePress = () => {
    navigation.navigate('Viewer', {
      item,
    });
  };

  const handleLongPress = () => {
    navigation.navigate('NewNotification', {
      article: item,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress} onLongPress={handleLongPress}>
      <RecommendCardBlock>
        <ReccomendTitle>추천</ReccomendTitle>
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
      </RecommendCardBlock>
    </TouchableWithoutFeedback>
  );
}

const RecommendCardBlock = styled.View`
  padding: 16px;
`;

const ReccomendTitle = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: ${(props) => props.theme.colors.primary};
  margin: 0 0 12px 8px;
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
  height: 240px;
  border-radius: 16px;

  ${(props) => props.scheme === 'dark'
    && css`
      opacity: 0.8;
    `}
`;

const Title = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.colors.typography.title};
  font-weight: bold;
`;

export default ArticleCard;
