import React, { ReactElement } from 'react';
import styled, { css } from '@emotion/native';
import { URL } from 'react-native-url-polyfill';
import { ArticleTimeLeft } from '../../features/article/useArticle';

const extractHostname = (url: string) => {
  const { hostname } = new URL(url);
  return hostname;
};

export interface ArticleCardDescriptionProps {
  url: string;
  timeLeft?: ArticleTimeLeft;
}

function ArticleCardDescription({
  url,
  timeLeft,
}: ArticleCardDescriptionProps): ReactElement {
  return (
    <WillreadCardDescriptionBlock>
      {timeLeft && (
        <>
          <TimeLeft accent={timeLeft.day < 1}>{timeLeft.label}</TimeLeft>
          <Separator>•</Separator>
        </>
      )}
      <Url numberOfLines={1}>{extractHostname(url)}</Url>
    </WillreadCardDescriptionBlock>
  );
}

const WillreadCardDescriptionBlock = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const TimeLeft = styled.Text<{accent: boolean}>`
  font-size: 11px;
  color: ${(props) => props.theme.colors.typography.secondary};

  ${(props) => props.accent && css`
    color: ${props.theme.colors.danger};
  `};
`;

const Url = styled.Text`
  font-size: 11px;
  color: ${(props) => props.theme.colors.typography.secondary};
  flex: 1;
`;

const Separator = styled.Text`
  font-size: 11px;
  color: ${(props) => props.theme.colors.typography.secondary};
  margin: 0 4px;
`;

export default ArticleCardDescription;
