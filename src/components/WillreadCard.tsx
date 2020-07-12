import React, { ReactElement } from 'react';
import {
  TouchableWithoutFeedback,
} from 'react-native';
import styled, { css } from 'styled-components/native';
import { useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { RootStackParamList } from '../config/Navigation';
import WillreadCardDescription from './WillreadCardDescription';
import CategoryBar from './CategoryBar';
import { Article, removeArticle } from '../features/articles';

export interface WillreadItemProps {
    item: Article;
}

function WillreadCard({
  item,
}: WillreadItemProps): ReactElement {
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
    uri,
    title,
    image: imageUri,
    minutesToRead,
    categoryColor,
  } = item;

  return (
    <TouchableWithoutFeedback onPress={handlePress} onLongPress={handleLongPress}>
      <WillreadItemBlock>
        <ThumbnailWrapper>
          <Thumbnail
            source={{
              uri: imageUri,
            }}
            scheme={scheme}
          />
        </ThumbnailWrapper>
        <Content>
          <CategoryBar categoryColor={categoryColor} />
          <Title numberOfLines={2}>
            {title}
          </Title>
          <WillreadCardDescription uri={uri} minutesToRead={minutesToRead} />
        </Content>
      </WillreadItemBlock>
    </TouchableWithoutFeedback>
  );
}

const WillreadItemBlock = styled.View`
    padding: 8px 16px;
    flex-direction: row;
`;

const ThumbnailWrapper = styled.View`
    border-radius: 16px;
    background-color: ${(props) => props.theme.colors.secondary};
`;

const Thumbnail = styled.Image<{scheme: ColorSchemeName}>`
    width: 96px;
    height: 96px;
    border-radius: 16px;

    ${(props) => props.scheme === 'dark' && css`
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

export default WillreadCard;
