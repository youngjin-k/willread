import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import calculateTimeLeft from '../../components/articleCard/calculateTimeLeft';
import { ARTICLE_EXPIRE_DAYS, MAX_ARTICLE_LIST_SPACE } from '../../constants';
import { getPreference } from '../../lib/utils/preferences';
import webBrowser from '../../lib/utils/webBrowser';
import { RootState } from '../store';
import {
  addArticle as addArticleAction,
  addScheduledNotification as addScheduledNotificationAction,
  Article,
  ArticleDraft,
  NotificationType,
  removeArticle as removeArticleAction,
  removeScheduledNotification as removeScheduledNotificationAction,
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

export const setNotification = async (
  date: Date,
  { data, title, body }: {data: Record<string, unknown>, title: string; body: string},
) => {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      data,
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

  const isArticleFull = useMemo(
    () => articles.length === MAX_ARTICLE_LIST_SPACE,
    [articles],
  );

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

  const removeDeviceNotificationAll = useCallback(
    async (article: Article) => {
      scheduledNotifications
        .filter((notification) => notification.articleId === article.id)
        .forEach((notification) => {
          Notifications.cancelScheduledNotificationAsync(
            notification.id,
          );
          dispatch(removeScheduledNotificationAction(notification.id));
        });
    },
    [dispatch, scheduledNotifications],
  );

  const removeDeviceNotification = useCallback(
    async (article: Article, type?: NotificationType) => {
      const scheduledNotification = scheduledNotifications.find(
        (notification) => (type
          ? notification.type === type && notification.articleId === article.id
          : notification.articleId === article.id),
      );

      if (!scheduledNotification) {
        return;
      }

      await Notifications.cancelScheduledNotificationAsync(
        scheduledNotification.id,
      );
      dispatch(removeScheduledNotificationAction(scheduledNotification.id));
    },
    [dispatch, scheduledNotifications],
  );

  const removeArticle = useCallback(
    async (article: Article) => {
      await removeDeviceNotificationAll(article);
      dispatch(removeArticleAction(article));
    },
    [dispatch, removeDeviceNotificationAll],
  );

  const removeScheduledNotification = useCallback(
    async (id: string) => {
      await Notifications.cancelScheduledNotificationAsync(id);
      dispatch(removeScheduledNotificationAction(id));
    },
    [dispatch],
  );

  const addCustomScheduledNotification = useCallback(
    async ({ date, article }: { date: Date; article: Article }) => {
      await removeDeviceNotification(article);

      const id = await setNotification(date, {
        title: '윌리드할 시간이에요!',
        body: article.title,
        data: {
          article,
        },
      });

      dispatch(
        addScheduledNotificationAction({
          id,
          articleId: article.id,
          date: dayjs(date).toString(),
        }),
      );
    },
    [dispatch, removeDeviceNotification],
  );

  const addExpireScheduledNotification = useCallback(
    async ({ article }: { article: Article }) => {
      await removeDeviceNotification(article, 'EXPIRE_ARTICLE');
      const date = dayjs(article.expiredAt).subtract(1, 'day').toDate();

      const id = await setNotification(date, {
        title: '24시간 후 삭제되는 아티클이 있어요. ⏰',
        body: article.title,
        data: {
          type: 'EXPIRE_ARTICLE',
          article,
        },
      });

      dispatch(
        addScheduledNotificationAction({
          id,
          articleId: article.id,
          date: date.toString(),
          type: 'EXPIRE_ARTICLE',
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
          dispatch(removeScheduledNotificationAction(scheduledNotification.id));
        }
      }

      webBrowser.open(article.url);
    },
    [dispatch, setLastReadAt, scheduledNotifications],
  );

  const addArticle = useCallback(
    (draft: ArticleDraft) => {
      dispatch(addArticleAction(draft));
    },
    [dispatch],
  );

  const getDisplayItems = useCallback(() => {
    let badgeCount = 0;
    const now = dayjs();

    articles
      .filter((article) => now.isAfter(dayjs(article.expiredAt)))
      .forEach((article) => {
        removeArticle(article);
      });

    const liveArticles = articles
      .filter((article) => now.isBefore(dayjs(article.expiredAt)))
      .sort((a, b) => dayjs(a.expiredAt).valueOf() - dayjs(b.expiredAt).valueOf());

    const displayItems: DisplayItem[] = liveArticles.map((article) => {
      const scheduledNotification = scheduledNotifications.find(
        (notification) => !notification.type && notification.articleId === article.id,
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
        timeLeft: calculateTimeLeft(article.expiredAt),
        isSetNotification,
        notificationTagType,
      };
    });

    Notifications.setBadgeCountAsync(badgeCount);
    return displayItems;
  }, [articles, removeArticle, scheduledNotifications]);

  const extendExpiryDate = useCallback(async (article: Article) => {
    const newArticle = { ...article, expiredAt: dayjs().add(ARTICLE_EXPIRE_DAYS, 'day').format() };

    dispatch(
      updateArticle({
        id: article.id,
        article: newArticle,
      }),
    );

    const allowExpireNotification = await getPreference('allowExpireNotification');

    if (allowExpireNotification === 'true') {
      addExpireScheduledNotification({ article: newArticle });
    }
  }, [addExpireScheduledNotification, dispatch]);

  return {
    articles,
    articleDraft,
    lastAddedArticle,
    scheduledNotifications,
    isArticleFull,
    addArticle,
    removeArticle,
    addCustomScheduledNotification,
    addExpireScheduledNotification,
    removeScheduledNotification,
    setLastReadAt,
    resetLastReadAt,
    readArticle,
    getDisplayItems,
    extendExpiryDate,
  };
}

export default useArticle;
