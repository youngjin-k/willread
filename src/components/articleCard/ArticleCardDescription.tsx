import React, { ReactElement } from 'react';
import styled, { css } from 'styled-components/native';

import { ArticleTimeLeft } from '../../screens/HomeScreen';

const extractHostname = (url: string) => {
  let hostname: string;

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  hostname = hostname.split(':')[0];
  hostname = hostname.split('?')[0];

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
      <Url>{extractHostname(url)}</Url>
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
    color: #FE4D4D;
  `};
`;

const Url = styled.Text`
  font-size: 11px;
  color: ${(props) => props.theme.colors.typography.secondary};
`;

const Separator = styled.Text`
  font-size: 11px;
  color: ${(props) => props.theme.colors.typography.secondary};
  margin: 0 4px;
`;

export default ArticleCardDescription;
