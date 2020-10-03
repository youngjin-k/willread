import * as Linking from 'expo-linking';
import React from 'react';
import { Platform } from 'react-native';
import styled from 'styled-components/native';
import Button from '../../components/Button';
import ScreenHeader from './ScreenHeader';

function PermissionSettingGuide(): React.ReactElement {
  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };
  return (
    <Container>
      <ScreenHeader />
      <Text>알림을 보낼 수 있는 권한이 필요해요.</Text>
      <Button label="권한 설정" onPress={openSettings} />
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Text = styled.Text``;

export default PermissionSettingGuide;
