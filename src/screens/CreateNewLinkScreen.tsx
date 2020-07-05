import React, { useState, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../config/Navigation';

function CreateNewLinkScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [uri, setUri] = useState('');

  const fetchUri = useCallback(() => {
    alert(uri);
  }, [uri]);

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'space-between' }}
      >
        <Header>
          <BackButton onPress={() => navigation.pop()}>
            <BackIcon name="chevron-left" />
          </BackButton>
          <Title>윌리드할 링크를 입력하세요</Title>
        </Header>

        <Content>
          <Input
            defaultValue={uri}
            onChangeText={(text) => setUri(text)}
          />
        </Content>

        <Actions>
          <TouchableOpacity activeOpacity={0.9}>
            <Button onPress={fetchUri}>
              <ButtonText>다음</ButtonText>
            </Button>
          </TouchableOpacity>
        </Actions>
      </KeyboardAvoidingView>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Header = styled.View`
  height: 56px;
  padding: 0 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const BackButton = styled(TouchableOpacity)`
  width: 56px;
  height: 56px;
  position: absolute;
  top: 0;
  left: 16px;
  justify-content: center;
`;

const BackIcon = styled(Feather)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.title};
`;

const Title = styled(Text)`
  font-size: 18px;
  color: ${(props) => props.theme.colors.typography.title};
`;

const Content = styled.View`
  justify-content: center;
  padding: 16px;
`;

const Input = styled.TextInput`
  height: 56px;
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.typography.title};
  border-radius: 16px;
  padding: 0 16px;
  font-size: 18px;
`;

const Actions = styled.View`
  padding: 16px;
  height: ${56 + 16 + 16}px;
`;

const Button = styled(TouchableOpacity)`
  height: 56px;
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

const ButtonText = styled.Text`
  font-size: 18px;
  color: #F9F9FD;
  font-weight: bold;
`;

export default CreateNewLinkScreen;
