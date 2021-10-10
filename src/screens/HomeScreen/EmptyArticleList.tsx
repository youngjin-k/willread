import React from 'react';
import FastImage from 'react-native-fast-image';
import styled from '@emotion/native';

import bookshelfEmpty from '../../../assets/bookshelf-empty.png';
import Line from '../../components/Line';

function EmptyArticleList() {
  return (
    <EmptyArticleListBlock>
      <ImageWrapper>
        <Image source={bookshelfEmpty} />
      </ImageWrapper>
      <Title>목록이 비어있어요.</Title>
      <Line
        marginTop={40}
        marginBottom={8}
      />
    </EmptyArticleListBlock>
  );
}

const EmptyArticleListBlock = styled.View`
  align-items: center;
`;

const ImageWrapper = styled.View`
  margin: 64px 0 24px 0;
`;

const Image = styled(FastImage)`
  width: 180px;
  height: 122px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.typography.primary};
`;

export default EmptyArticleList;
