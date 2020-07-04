import React, { ReactElement } from 'react';
import {
  TouchableWithoutFeedback,
} from 'react-native';
import styled, { css } from 'styled-components/native';
import { useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { CategoryColors } from './CategoryFilter';

export interface Category {
    color: CategoryColors;
    label?: string;
}

export interface WillreadItem {
    id: string;
    URI: string;
    title: string;
    description?: string;
    imageURI?: string;
    categoryColor?: CategoryColors;
    minutesToRead?: number;
}

export interface RecommendCardProps {
    item: WillreadItem
}

function RecommendCard({
  item: {
    URI,
    title,
    imageURI,
    minutesToRead,
  },
}: RecommendCardProps): ReactElement {
  const scheme = useColorScheme();

  return (
    <Container>
      <RecommendCardBlock>
        <ReccomendTitle>추천</ReccomendTitle>
        <ThumbnailWrapper>
          <Thumbnail
            source={{
              uri: imageURI,
            }}
            scheme={scheme}
          />
        </ThumbnailWrapper>
        <Title>{title}</Title>
        <SubTitle>{`${URI} • ${minutesToRead}min read`}</SubTitle>
      </RecommendCardBlock>
    </Container>
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
    color: ${(props) => props.theme.colors.typography.primary};
    margin: 0 0 8px 8px;
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
    margin: 16px 0 0 8px;
    font-weight: bold;
`;

const SubTitle = styled.Text`
    font-size: 12px;
    color: ${(props) => props.theme.colors.typography.secondary};
    margin: 4px 0 0 8px;
`;

export default RecommendCard;
