import React, { ReactElement } from 'react';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import Actions from './Actions';
import Button, { ButtonSize } from '../Button';
import { RootStackParamList } from '../../config/Navigation';

function Complete(): ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const handlePressClose = () => {
    navigation.pop();
  };

  const handlePressNewNotification = () => {
    navigation.pop();
    navigation.navigate('NewNotification');
  };

  return (
    <>
      <Container>
        <IconWrapper>
          <Icon name="check" />
        </IconWrapper>
        <Title>윌리드 등록 완료</Title>
        <SubTitle>윌리드와 함께 성장하세요</SubTitle>
        <Button onPress={handlePressNewNotification} label="알림 설정" />
      </Container>

      <Actions>
        <Button onPress={handlePressClose} label="완료" size={ButtonSize.Large} />
      </Actions>
    </>
  );
}

const Container = styled.View`
  justify-content: center;
  align-items: center;
  padding: 0 16px;
  flex: 1;
`;

const IconWrapper = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 48px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.primary};
  margin-bottom: 32px;
  padding-top: 12px;
  box-shadow: 0 3px 17px rgba(0, 0, 0, 0.24);
`;

const Icon = styled(Feather)`
  font-size: 60px;
  color: #fff;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.typography.title};
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.typography.secondary};
`;

export default Complete;
