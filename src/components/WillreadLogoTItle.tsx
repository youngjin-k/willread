import React from 'react';
import { useColorScheme } from 'react-native';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';

import willreadDark from '../../assets/willread-dark.png';
import willreadLight from '../../assets/willread-light.png';

function WillreadLogoTitle() {
  const scheme = useColorScheme();

  return (
    <TextLogo
      resizeMode="contain"
      source={scheme === 'dark' ? willreadDark : willreadLight}
    />
  );
}

const TextLogo = styled(FastImage)`
  margin: 0 0 4px 0;
  width: 130px;
  height: 24px;
`;

export default WillreadLogoTitle;
