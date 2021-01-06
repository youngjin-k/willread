import React, { ReactElement } from 'react';
import styled from 'styled-components/native';

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
}

function ArticleCardDescription({
  url,
}: ArticleCardDescriptionProps): ReactElement {
  return (
    <WillreadCardDescriptionBlock>
      <Description>{extractHostname(url)}</Description>
    </WillreadCardDescriptionBlock>
  );
}

const WillreadCardDescriptionBlock = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const Description = styled.Text`
  font-size: 11px;
  color: ${(props) => props.theme.colors.typography.secondary};
`;

export default ArticleCardDescription;
