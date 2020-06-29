import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function MyScreen(): JSX.Element {
  return (
    <View style={styles.container}>
      <Text>MyScreen</Text>
    </View>
  );
}

export default MyScreen;
