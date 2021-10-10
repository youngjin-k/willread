import { Linking } from 'react-native';
import React from 'react';
import styled from '@emotion/native';

import Button, { ButtonVariant } from '../../components/Button';
import ScreenHeader from './ScreenHeader';

const openSettings = () => {
  Linking.openSettings();
};

function PermissionSettingGuide(): React.ReactElement {
  return (
    <Container>
      <ScreenHeader />
      <Main>
        <Title>알림을 보낼 수 있는 권한이 없어요.</Title>
        <Description>아래 버튼을 눌러 알림 권한을 활성화 해주세요.</Description>
        <ButtonWrapper>
          <Button
            label="설정화면으로 이동"
            onPress={openSettings}
            variant={ButtonVariant.PrimaryTenderContained}
            style={{ paddingHorizontal: 16 }}
          />
        </ButtonWrapper>
      </Main>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Main = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled.View`
  margin-top: 16px;
`;

const Title = styled.Text`
  color: ${(props) => props.theme.colors.typography.primary};
  font-size: 16px;
`;

const Description = styled.Text`
  margin-top: 8px;
  color: ${(props) => props.theme.colors.typography.secondary};
  font-size: 14px;
`;

export default PermissionSettingGuide;
