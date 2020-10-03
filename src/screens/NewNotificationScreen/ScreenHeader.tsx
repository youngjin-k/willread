import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import styled from 'styled-components/native';

import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import { RootStackParamList } from '../../config/Navigation';

function ScreenHeader(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  return (
    <ScreenHeaderBlock>
      <HeaderTitle>알림 설정</HeaderTitle>
      <CloseButtonWrapper>
        <Button
          onPress={() => navigation.pop()}
          variant={ButtonVariant.DefaultText}
          size={ButtonSize.Small}
        >
          <BackIcon name="x" />
        </Button>
      </CloseButtonWrapper>
    </ScreenHeaderBlock>
  );
}

const ScreenHeaderBlock = styled.View`
  height: 56px;
  padding: 0 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const CloseButtonWrapper = styled.View`
  padding: 0 16px;
  height: 56px;
  width: ${32 + 32}px;
  position: absolute;
  top: 0;
  right: 0;
  justify-content: center;
`;

const BackIcon = styled(Feather)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.title};
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.colors.typography.title};
  font-weight: bold;
`;

export default ScreenHeader;
