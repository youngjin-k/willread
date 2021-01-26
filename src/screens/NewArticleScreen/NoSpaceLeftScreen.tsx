import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import styled from 'styled-components/native';

import Button, { ButtonSize } from '../../components/Button';
import { RootStackParamList, TabParamList } from '../../config/Navigation';

function NoSpaceScreen() {
  const navigation = useNavigation<
    StackNavigationProp<RootStackParamList & TabParamList>
  >();

  const handlePressClose = () => {
    navigation.pop();
  };

  return (
    <Container>
      <Content>
        <Title>더 이상 등록할 수 없어요.</Title>
        <SubTitle>모든 공간이 가득 찼어요.</SubTitle>
      </Content>

      <Actions>
        <Button
          onPress={handlePressClose}
          label="확인"
          size={ButtonSize.Large}
        />
      </Actions>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.typography.primary};
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.typography.secondary};
`;

const Actions = styled.View`
  padding: 16px;
`;

export default NoSpaceScreen;
