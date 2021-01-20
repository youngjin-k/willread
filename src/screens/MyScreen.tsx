import * as React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import * as Notifications from 'expo-notifications';

import styled from 'styled-components/native';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import useArticle from '../features/article/useArticle';
import { DEVforceUpdateArticles } from '../features/article/articles';

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
  const dispatch = useDispatch();
  const {
    articles,
    scheduledNotifications,
    removeScheduledNotification,
  } = useArticle();

  const logScheduledNotifications = () => {
    console.log(scheduledNotifications);
  };

  const clearAllScheduledNotifications = () => {
    scheduledNotifications.forEach((notification) => {
      removeScheduledNotification(notification.id);
    });
  };

  const forceUpdateArticles = () => {
    const data = [
      {
        createdAt: dayjs().subtract(7, 'day').add(1, 'hour').format(),
        description:
          'Definitive answers and clarification on the purpose and use cases for Context and Redux',
        expiredAt: dayjs().add(1, 'hour').format(),
        favicon:
          'https://blog.isquaredsoftware.com/images/favicon.ico?2016-09-13',
        id: '8Nb13tCnAZOYu_cG3hhz7',
        image: 'https://blog.isquaredsoftware.com/images/logo.png',
        title:
          'Blogged Answers: Why React Context is Not a "State Management" Tool (and Why It Doesn\'t Replace Redux)',
        url:
          'https://blog.isquaredsoftware.com/2021/01/blogged-answers-why-react-context-is-not-a-state-management-tool-and-why-it-doesnt-replace-redux/?fbclid=IwAR1M5yW-vHkptvQMtGqR3OTtPzPZntFcD2Sn3tCi8PlUH6SvuhCBRCegWFo',
      },
      {
        createdAt: dayjs().subtract(7, 'day').add(4, 'hour').format(),
        description:
          'Learn how to implement Pull to Refresh functionality in React Native apps using RefreshControl component',
        expiredAt: dayjs().add(4, 'hour').format(),
        favicon: 'https://miro.medium.com/1*m-R_BkNf1Qjr1YbyOIJY2w.png',
        id: 'io3mfVO_eed1IcyJCuFXs',
        image: 'https://miro.medium.com/max/1200/1*4rJ3Ex2gSvsQtXrZY619NQ.png',
        title: 'RefreshControl - Pull to Refresh in React Native Apps',
        url:
          'https://medium.com/enappd/refreshcontrol-pull-to-refresh-in-react-native-apps-dfe779118f75',
      },
      {
        createdAt: '2021-01-20T23:21:38+09:00',
        description:
          'This component is used inside a ScrollView or ListView to add pull to refresh functionality. When the ScrollView is at scrollY: 0, swiping down triggers an onRefresh event.',
        expiredAt: '2021-01-27T23:21:38+09:00',
        favicon: 'https://reactnative.dev/img/favicon.ico',
        id: 'R_CcMC4vc0ePZJQlDNJhV',
        image: 'https://reactnative.dev/img/logo-og.png',
        title: 'RefreshControl · React Native',
        url: 'https://reactnative.dev/docs/refreshcontrol',
      },
    ];

    dispatch(DEVforceUpdateArticles(data));
  };

  return (
    <View style={styles.container}>
      <Button
        title="log articles"
        onPress={() => {
          console.log(articles);
        }}
      />

      <Spacer />

      <Button
        title="log all notifications"
        onPress={() => {
          logAllNotifications();
        }}
      />

      <Button
        title="clear all notifications"
        onPress={() => {
          cancelAllNotifications();
        }}
      />

      <Spacer />

      <Button
        title="log scheduledNotifications store data"
        onPress={() => {
          logScheduledNotifications();
        }}
      />
      <Button
        title="clear all scheduledNotifications store data"
        onPress={() => {
          clearAllScheduledNotifications();
        }}
      />

      <Spacer />
      <Button
        title="force update articles"
        onPress={() => {
          forceUpdateArticles();
        }}
      />
    </View>
  );
}

const Spacer = styled.View`
  height: 20px;
`;

export default MyScreen;
