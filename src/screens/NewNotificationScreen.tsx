import React from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';

function NewNotificationScreen(): React.ReactElement {
  return (
    <Container>
      <Text>
        NewNotificationScreen
      </Text>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

export default NewNotificationScreen;
