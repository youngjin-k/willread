import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import styled from '@emotion/native';

import { DEVforceUpdateArticles } from '../../../features/article/articles';
import useArticle from '../../../features/article/useArticle';
import willreadToast from '../../../lib/willreadToast';
import MenuItem from '../MenuItem';
import MenuList from '../MenuList';

const logAllNotifications = async () => {
  const result = await Notifications.getAllScheduledNotificationsAsync();
  console.log(`notifications: ${result.length}`);
  console.log(result);
};

const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

function DeveloperScreen() {
  const dispatch = useDispatch();
  const {
    articles,
    pendingList,
    scheduledNotifications,
    removeScheduledNotification,
    removePendingList,
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
        createdAt: dayjs().subtract(7, 'day').add(4, 'hour').format(),
        description:
          'This component is used inside a ScrollView or ListView to add pull to refresh functionality. When the ScrollView is at scrollY: 0, swiping down triggers an onRefresh event.',
        expiredAt: dayjs().add(4, 'hour').format(),
        favicon: 'https://reactnative.dev/img/favicon.ico',
        id: 'test',
        image: 'https://reactnative.dev/img/logo-og.png',
        title: 'RefreshControl · React Native',
        url: 'https://reactnative.dev/docs/refreshcontrol',
      },
      {
        createdAt: dayjs().subtract(7, 'day').add(4, 'hour').format(),
        description:
          'This component is used inside a ScrollView or ListView to add pull to refresh functionality. When the ScrollView is at scrollY: 0, swiping down triggers an onRefresh event.',
        expiredAt: dayjs().add(4, 'hour').format(),
        favicon: 'https://reactnative.dev/img/favicon.ico',
        id: 'test1',
        image: 'https://reactnative.dev/img/logo-og.png',
        title: 'RefreshControl · React Native',
        url: 'https://reactnative.dev/docs/refreshcontrol',
      },
      {
        createdAt: dayjs().subtract(7, 'day').add(4, 'hour').format(),
        description:
          'This component is used inside a ScrollView or ListView to add pull to refresh functionality. When the ScrollView is at scrollY: 0, swiping down triggers an onRefresh event.',
        expiredAt: dayjs().add(4, 'hour').format(),
        favicon: 'https://reactnative.dev/img/favicon.ico',
        id: 'test3',
        image: 'https://reactnative.dev/img/logo-og.png',
        title: 'RefreshControl · React Native',
        url: 'https://reactnative.dev/docs/refreshcontrol',
      },
    ];

    dispatch(DEVforceUpdateArticles(data));
  };

  const clearPendingList = () => {
    pendingList.forEach((article) => {
      removePendingList(article);
    });
  };

  return (
    <Container>
      <ScrollView>
        <MenuList title="log">
          <MenuItem
            title="log articles"
            onPress={() => {
              console.log(articles);
            }}
          />
          <MenuItem
            title="log pendingList"
            onPress={() => {
              console.log(pendingList);
            }}
          />
          <MenuItem
            title="log all notifications"
            onPress={() => {
              logAllNotifications();
            }}
          />
          <MenuItem
            title="log scheduledNotifications store data"
            onPress={() => {
              logScheduledNotifications();
            }}
          />
        </MenuList>

        <MenuList title="actions">
          <MenuItem
            title="clear pendingList"
            onPress={() => {
              clearPendingList();
            }}
          />

          <MenuItem
            title="clear all notifications"
            onPress={() => {
              cancelAllNotifications();
            }}
          />

          <MenuItem
            title="clear all scheduledNotifications store data"
            onPress={() => {
              clearAllScheduledNotifications();
            }}
          />

          <MenuItem
            title="force update articles"
            onPress={() => {
              forceUpdateArticles();
            }}
          />

          <MenuItem
            title="show toast"
            onPress={() => {
              willreadToast.showSimple(
                '대기 목록에 있던 아티클이 자동으로 추가되었어요.',
              );
            }}
          />
        </MenuList>
      </ScrollView>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const ScrollView = styled.ScrollView``;

export default DeveloperScreen;
