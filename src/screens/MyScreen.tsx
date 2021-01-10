import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';

import useArticle from '../features/article/useArticle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function MyScreen(): JSX.Element {
  const { articles } = useArticle();

  return (
    <View style={styles.container}>
      <Button
        title="log articles"
        onPress={() => { console.log(articles); }}
      />
    </View>
  );
}

export default MyScreen;
