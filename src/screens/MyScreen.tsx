import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import * as Notifications from 'expo-notifications';

import styled from 'styled-components/native';
import useArticle from '../features/article/useArticle';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const logAllNotifications = async () => {
  const result = await Notifications.getAllScheduledNotificationsAsync();
  console.log(`notifications: ${result.length}`);
  console.log(result);
};

const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

function MyScreen(): JSX.Element {
  const { articles, scheduledNotifications, removeScheduledNotification } = useArticle();

  const logScheduledNotifications = () => {
    console.log(scheduledNotifications);
  };

  const clearAllScheduledNotifications = () => {
    scheduledNotifications.forEach((notification) => {
      removeScheduledNotification(notification.id);
    });
  };

  return (
    <View style={styles.container}>
      <Button
        title="log articles"
        onPress={() => { console.log(articles); }}
      />

      <Spacer />

      <Button
        title="log all notifications"
        onPress={() => { logAllNotifications(); }}
      />

      <Button
        title="clear all notifications"
        onPress={() => { cancelAllNotifications(); }}
      />

      <Spacer />

      <Button
        title="log scheduledNotifications store data"
        onPress={() => { logScheduledNotifications(); }}
      />
      <Button
        title="clear all scheduledNotifications store data"
        onPress={() => { clearAllScheduledNotifications(); }}
      />
    </View>
  );
}

const Spacer = styled.View`
  height: 20px;
`;

export default MyScreen;
