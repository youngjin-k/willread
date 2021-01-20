import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import calculateTimeLeft from '../../components/articleCard/calculateTimeLeft';
import webBrowser from '../../lib/utils/webBrowser';
import { RootState } from '../store';
import {
  addArticle,
  addScheduledNotification as addScheduledNotificationSlice,
  Article,
  ArticleDraft,
  removeArticle as removeArticleSlice,
  removeScheduledNotification as removeScheduledNotificationSlice,
  updateArticle,
} from './articles';

export interface ArticleTimeLeft {
  second: number;
  day: number;
  hour: number;
  minute: number;
  label: string;
  detailLabel: string;
}

export interface DisplayItem {
  article: Article;
  timeLeft: ArticleTimeLeft;
  isSetNotification: boolean;
  notificationTagType: 'default' | 'accent';
}

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

  const setLastReadAt = useCallback(
    (article: Article) => {
      dispatch(
        updateArticle({
          id: article.id,
          article: { ...article, lastReadAt: dayjs().toString() },
        }),
      );
    },
    [dispatch],
  );

  const resetLastReadAt = (article: Article) => {
    dispatch(
      updateArticle({
        id: article.id,
        article: { ...article, lastReadAt: undefined },
      }),
    );
  };

  const removeDeviceNotification = useCallback(
    async (article: Article) => {
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
    },
    [dispatch, scheduledNotifications],
  );

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
    async ({ date, article }: { date: Date; article: Article }) => {
      await removeDeviceNotification(article);

      const id = await setNotification(date, article);

      dispatch(
        addScheduledNotificationSlice({
          id,
          articleId: article.id,
          date: dayjs(date).toString(),
        }),
      );
    },
    [dispatch, removeDeviceNotification],
  );

  const readArticle = useCallback(
    async (article: Article) => {
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

      webBrowser.open(article.url);
    },
    [dispatch, setLastReadAt, scheduledNotifications],
  );

  const getDisplayItems = useCallback(() => {
    let badgeCount = 0;
    const now = dayjs();

    articles
      .filter((article) => now.isAfter(dayjs(article.expiredAt)))
      .forEach((article) => {
        removeArticle(article);
      });

    const displayItems: DisplayItem[] = articles
      .filter((article) => now.isBefore(dayjs(article.expiredAt)))
      .map((article) => {
        const scheduledNotification = scheduledNotifications.find(
          (notification) => notification.articleId === article.id,
        );

        let isSetNotification = false;
        let notificationTagType: DisplayItem['notificationTagType'] = 'default';

        if (scheduledNotification) {
          isSetNotification = true;

          if (dayjs(scheduledNotification.date).isBefore(now)) {
            notificationTagType = 'accent';
            badgeCount += 1;
          }
        }

        return {
          article,
          timeLeft: calculateTimeLeft(article.createdAt),
          isSetNotification,
          notificationTagType,
        };
      });

    Notifications.setBadgeCountAsync(badgeCount);
    return displayItems;
  }, [articles, scheduledNotifications, removeArticle]);

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
    getDisplayItems,
  };
}

export default useArticle;
