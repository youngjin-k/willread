import * as React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';

function CreateNewLinkScreen({ navigation }): React.ReactElement {
  const insets = useSafeArea();
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
          <TextInput style={styles.linkInput} />
        </Content>

        <Actions>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity
              onPress={() => alert('test')}
              activeOpacity={0.8}
            >
              <View style={styles.nextButton}>
                <Text style={styles.nextButtonText}>다음</Text>
              </View>
            </TouchableOpacity>
          </View>
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

const Actions = styled.View`
  padding: 16px;
  height: ${56 + 16 + 16}px;
`;

const styles = StyleSheet.create({
  linkInput: {
    height: 56,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 18,
  },
  buttonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  nextButton: {
    height: 56,
    backgroundColor: '#5484FF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 22,
    color: '#fff',
  },
});

export default CreateNewLinkScreen;
