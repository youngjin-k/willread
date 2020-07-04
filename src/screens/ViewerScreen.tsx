import * as React from 'react';
import { useColorScheme } from 'react-native';
import styled from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../config/Navigation';

function ViewerScreen(): React.ReactElement {
  const scheme = useColorScheme();
  const route = useRoute();
  const navigation = useNavigation();

  return (
    <Container>
      <Text>{JSON.stringify(route.params, null, 2)}</Text>
      <Button onPress={() => navigation.pop()} title="close" />
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Text = styled.Text`
  color: ${(props) => props.theme.colors.typography.title};
`;

const Button = styled.Button``;

export default ViewerScreen;
