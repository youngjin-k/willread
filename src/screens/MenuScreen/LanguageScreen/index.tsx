import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';

import MenuItem from '../MenuItem';
import MenuList from '../MenuList';

function LanguageScreen() {
  const [theme, setTheme] = useState('Kr');

  return (
    <Container>
      <ScrollView>
        <MenuList>
          <MenuItem
            title="한국어"
            checked={theme === 'Kr'}
            onPress={() => setTheme('Kr')}
          />
          <MenuItem
            title="English"
            checked={theme === 'En'}
            onPress={() => setTheme('En')}
          />
        </MenuList>
      </ScrollView>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const ScrollView = styled.ScrollView``;

export default LanguageScreen;
