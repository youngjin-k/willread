import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function HistoryScreen(): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text>HistoryScreen</Text>
    </View>
  );
}

export default HistoryScreen;
