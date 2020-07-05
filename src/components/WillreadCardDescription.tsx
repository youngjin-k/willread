import React, { ReactElement } from 'react';
import styled from 'styled-components/native';

export interface WillreadCardDescriptionProps {
    uri: string;
    minutesToRead: number;
}

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

function WillreadCardDescription({
  uri,
  minutesToRead,
}: WillreadCardDescriptionProps): ReactElement {
  return (
    <WillreadCardDescriptionBlock>
      {minutesToRead > 0 && (
      <Description>
        {minutesToRead}
        min read
      </Description>)}
      <Separator>•</Separator>
      <Description>{extractHostname(uri)}</Description>
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

const Separator = styled.Text`
    font-size: 11px;
    color: ${(props) => props.theme.colors.typography.secondary};
    margin: 0 4px;
`;

export default WillreadCardDescription;
