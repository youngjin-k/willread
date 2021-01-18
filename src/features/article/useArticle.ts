import { useDispatch, useSelector } from 'react-redux';
import * as Notifications from 'expo-notifications';
import { useCallback } from 'react';
import dayjs from 'dayjs';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Linking } from 'react-native';
import { RootState } from '../store';
import {
  ArticleDraft,
  addArticle,
  removeArticle as removeArticleSlice,
  Article,
  updateArticle,
  addScheduledNotification as addScheduledNotificationSlice,
  removeScheduledNotification as removeScheduledNotificationSlice,
} from './articles';

const setNotification = async (date: Date, article: Article) => {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: '윌리드할 시간이에요!',
      body: article.title,
      sound: 'default',
      data: {
        article,
      },
      badge: 1,
    },
    trigger: date,
  });
  return id;
};

function useArticle() {
  const dispatch = useDispatch();
  const {
    articles,
    articleDraft,
    lastAddedArticle,
    scheduledNotifications,
  } = useSelector((state: RootState) => state.articles);

  const setLastReadAt = useCallback((article: Article) => {
    dispatch(
      updateArticle({
        id: article.id,
        article: { ...article, lastReadAt: dayjs().toString() },
      }),
    );
  }, [dispatch]);

  const resetLastReadAt = (article: Article) => {
    dispatch(
      updateArticle({
        id: article.id,
        article: { ...article, lastReadAt: undefined },
      }),
    );
  };

  const removeDeviceNotification = useCallback(async (article: Article) => {
    const scheduledNotification = scheduledNotifications.find(
      (notification) => notification.articleId === article.id,
    );

    if (!scheduledNotification) {
      return;
    }

    await Notifications.cancelScheduledNotificationAsync(
      scheduledNotification.id,
    );
    dispatch(removeScheduledNotificationSlice(scheduledNotification.id));
  }, [dispatch, scheduledNotifications]);

  const removeArticle = useCallback(
    async (article: Article) => {
      await removeDeviceNotification(article);
      dispatch(removeArticleSlice(article));
    },
    [dispatch, removeDeviceNotification],
  );

  const removeScheduledNotification = useCallback(
    async (id: string) => {
      await Notifications.cancelScheduledNotificationAsync(id);
      dispatch(removeScheduledNotificationSlice(id));
    },
    [dispatch],
  );

  const addScheduledNotification = useCallback(
    async ({ date, article }: {date: Date; article: Article}) => {
      await removeDeviceNotification(article);

      const id = await setNotification(date, article);

      dispatch(addScheduledNotificationSlice({
        id,
        articleId: article.id,
        date: dayjs(date).toString(),
      }));
    },
    [dispatch, removeDeviceNotification],
  );

  const readArticle = useCallback(async (article: Article) => {
    setLastReadAt(article);

    const scheduledNotification = scheduledNotifications.find(
      (notification) => notification.articleId === article.id,
    );

    if (scheduledNotification) {
      const now = dayjs();

      if (dayjs(scheduledNotification.date).isBefore(now)) {
        dispatch(removeScheduledNotificationSlice(scheduledNotification.id));
      }
    }

    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(article.url, {
        // iOS Properties
        readerMode: false,
        animated: true,
        modalPresentationStyle: 'fullScreen',
        modalTransitionStyle: 'coverVertical',
        modalEnabled: false,
        enableBarCollapsing: true,

        // Android Properties
        showTitle: true,
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
      });
    } else {
      Linking.openURL(article.url);
    }
  }, [dispatch, setLastReadAt, scheduledNotifications]);

  return {
    articles,
    articleDraft,
    lastAddedArticle,
    scheduledNotifications,
    addArticle: (draft: ArticleDraft) => dispatch(addArticle(draft)),
    removeArticle,
    addScheduledNotification,
    removeScheduledNotification,
    setLastReadAt,
    resetLastReadAt,
    readArticle,
  };
}

export default useArticle;
