import React, { ReactElement } from 'react';
import {
  TouchableWithoutFeedback,
} from 'react-native';
import styled, { css } from 'styled-components/native';
import { useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CategoryColors } from './CategoryFilter';
import { RootStackParamList } from '../config/Navigation';
import WillreadCardDescription from './WillreadCardDescription';

export interface Category {
    color: CategoryColors;
    label?: string;
}

export interface WillreadItem {
    id: string;
    uri: string;
    title: string;
    description?: string;
    imageUri?: string;
    categoryColor?: CategoryColors;
    minutesToRead: number;
}

export interface RecommendCardProps {
    item: WillreadItem
}

function RecommendCard({ item }: RecommendCardProps): ReactElement {
  const scheme = useColorScheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const {
    uri,
    title,
    imageUri,
    minutesToRead,
  } = item;

  const handlePress = () => {
    navigation.navigate('Viewer', {
      item,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <RecommendCardBlock>
        <ReccomendTitle>추천</ReccomendTitle>
        <ThumbnailWrapper>
          <Thumbnail
            source={{
              uri: imageUri,
            }}
            scheme={scheme}
          />
        </ThumbnailWrapper>
        <Title>{title}</Title>
        <WillreadCardDescription uri={uri} minutesToRead={minutesToRead} />
      </RecommendCardBlock>
    </TouchableWithoutFeedback>
  );
}

const Container = styled(TouchableWithoutFeedback)`
`;

const RecommendCardBlock = styled.View`
    padding: 16px;
`;

const ReccomendTitle = styled.Text`
    font-weight: bold;
    font-size: 14px;
    color: ${(props) => props.theme.colors.primary};
    margin: 0 0 12px 16px;
    font-weight: bold;
`;

const ThumbnailWrapper = styled.View`
    border-radius: 16px;
    background-color: ${(props) => props.theme.colors.secondary};
`;

const Thumbnail = styled.Image<{scheme: ColorSchemeName}>`
    width: 100%;
    height: 240px;
    border-radius: 16px;

    ${(props) => props.scheme === 'dark' && css`
        opacity: 0.8;
    `}
`;

const Title = styled.Text`
    font-size: 18px;
    color: ${(props) => props.theme.colors.typography.title};
    margin: 16px 0 0 0;
    font-weight: bold;
`;

export default RecommendCard;
