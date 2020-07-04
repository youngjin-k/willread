import React, { ReactElement } from 'react';
import {
  TouchableWithoutFeedback,
} from 'react-native';
import styled, { css } from 'styled-components/native';
import { useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { WillreadItem as IWillreadItem } from './RecommendCard';

export interface WillreadItemProps {
    item: IWillreadItem
}

function WillreadItem({
  item: {
    URI,
    title,
    imageURI,
    minutesToRead,
  },
}: WillreadItemProps): ReactElement {
  const scheme = useColorScheme();

  return (
    <TouchableWithoutFeedback>
      <WillreadItemBlock>
        <ThumbnailWrapper>
          <Thumbnail
            source={{
              uri: imageURI,
            }}
            scheme={scheme}
          />
        </ThumbnailWrapper>
        <Content>
          <Title
            numberOfLines={2}
          >
            {title}
          </Title>
          <SubTitle>{`${URI} • ${minutesToRead}min read`}</SubTitle>
        </Content>
      </WillreadItemBlock>
    </TouchableWithoutFeedback>
  );
}

const Container = styled(TouchableWithoutFeedback)`
`;

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
    padding-left: 8px;
`;

const Title = styled.Text`
    font-size: 16px;
    color: ${(props) => props.theme.colors.typography.title};
    margin: 0 0 0 8px;
    font-weight: bold;
`;

const SubTitle = styled.Text`
    font-size: 12px;
    color: ${(props) => props.theme.colors.typography.secondary};
    margin: 4px 0 0 8px;
`;

export default WillreadItem;
