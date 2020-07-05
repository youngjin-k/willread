import React, { ReactElement } from 'react';
import {
  TouchableWithoutFeedback,
} from 'react-native';
import styled, { css } from 'styled-components/native';
import { useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { WillreadItem as IWillreadItem } from './RecommendCard';
import { RootStackParamList } from '../config/Navigation';
import WillreadCardDescription from './WillreadCardDescription';

export interface WillreadItemProps {
    item: IWillreadItem;
}

function WillreadCard({
  item,
}: WillreadItemProps): ReactElement {
  const scheme = useColorScheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    navigation.navigate('Viewer', {
      item,
    });
  };

  const {
    uri,
    title,
    imageUri,
    minutesToRead,
  } = item;

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
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
    padding: 0 16px 16px 16px;
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
