import * as React from 'react';
import { useSafeArea } from 'react-native-safe-area-context';
import {
  View, Text, StyleSheet, Image, useColorScheme, TouchableWithoutFeedback,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import willreadLight from '../../assets/willread-light.png';
import willreadDark from '../../assets/willread-dark.png';
import thumb from '../../assets/thumb.jpg';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    margin: 16,
  },
  recommendCard: {
    paddingHorizontal: 16,
  },
  recommendText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#332FFF',
    marginBottom: 8,
    marginLeft: 8,
  },
  recommendCardThumbnail: {
    flex: 1,
    width: '100%',
    height: 240,
    borderRadius: 16,
  },
  recommendCardTitle: {
    fontSize: 18,
    color: '#000',
    marginTop: 16,
    marginLeft: 8,
  },
  recommendCardSubTitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 4,
    marginLeft: 8,
  },
});

function HomeScreen(): React.ReactElement {
  const scheme = useColorScheme();
  const insets = useSafeArea();
  return (
    <ScrollView style={[styles.container, {
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }]}
    >
      <View style={styles.header}>
        <Image source={scheme === 'dark' ? willreadDark : willreadLight} />
      </View>
      <TouchableWithoutFeedback onPress={() => alert('click 추천')}>
        <View style={styles.recommendCard}>
          <Text style={styles.recommendText}>추천</Text>
          <Image
            source={thumb}
            style={styles.recommendCardThumbnail}
            resizeMode="center"
          />
          <Text style={styles.recommendCardTitle}>디자이너는 왜 그리드 시스템을 알아야 할까?</Text>
          <Text style={styles.recommendCardSubTitle}>https://brunch.co.kr • 3min read</Text>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

export default HomeScreen;
