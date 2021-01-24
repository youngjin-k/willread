import * as React from 'react';
import { useState } from 'react';
import styled from 'styled-components/native';

import MenuItem from '../MenuItem';
import MenuList from '../MenuList';

function ThemeScreen() {
  const [theme, setTheme] = useState('system');

  return (
    <Container>
      <ScrollView>
        <MenuList>
          <MenuItem
            title="밝은 화면"
            menuIconName="sun"
            checked={theme === 'light'}
            onPress={() => setTheme('light')}
          />
          <MenuItem
            title="어두운 화면"
            menuIconName="moon"
            checked={theme === 'dark'}
            onPress={() => setTheme('dark')}
          />
          <MenuItem
            title="시스템 설정에 맞춤"
            menuIconName="sliders"
            checked={theme === 'system'}
            onPress={() => setTheme('system')}
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

export default ThemeScreen;
