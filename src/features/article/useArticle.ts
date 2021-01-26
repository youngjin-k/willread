import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import calculateTimeLeft from '../../components/articleCard/calculateTimeLeft';
import { MAX_ARTICLE_LIST_SPACE, MAX_PENDING_LIST_SPACE } from '../../constants';
import webBrowser from '../../lib/utils/webBrowser';
import willreadToast from '../../lib/willreadToast';
import { RootState } from '../store';
import {
  addArticle as addArticleAction,
  addPendingList as addPendingListAction,
  addScheduledNotification as addScheduledNotificationAction,
  Article,
  ArticleDraft,
  removeArticle as removeArticleAction,
  removePendingList as removePendingListAction,
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
    pendingList,
  } = useSelector((state: RootState) => state.articles);

  const isArticleFull = useMemo(
    () => articles.length === MAX_ARTICLE_LIST_SPACE,
    [articles],
  );
  const isPendingListFull = useMemo(
    () => pendingList.length === MAX_PENDING_LIST_SPACE,
    [pendingList],
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
      dispatch(removeScheduledNotificationAction(scheduledNotification.id));
    },
    [dispatch, scheduledNotifications],
  );

  const removeArticle = useCallback(
    async (article: Article) => {
      await removeDeviceNotification(article);
      dispatch(removeArticleAction(article));
    },
    [dispatch, removeDeviceNotification],
  );

  const removeScheduledNotification = useCallback(
    async (id: string) => {
      await Notifications.cancelScheduledNotificationAsync(id);
      dispatch(removeScheduledNotificationAction(id));
    },
    [dispatch],
  );

  const addScheduledNotification = useCallback(
    async ({ date, article }: { date: Date; article: Article }) => {
      await removeDeviceNotification(article);

      const id = await setNotification(date, article);

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
      if (isArticleFull) {
        dispatch(addPendingListAction(draft));
        return 'pendingList';
      }

      dispatch(addArticleAction(draft));
      return 'articleList';
    },
    [dispatch, isArticleFull],
  );

  const removePendingList = useCallback(
    (article: Article) => {
      dispatch(removePendingListAction(article));
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

    const liveArticles = articles.filter((article) => now.isBefore(dayjs(article.expiredAt)));

    if (
      liveArticles.length < MAX_ARTICLE_LIST_SPACE
      && pendingList.length > 0
    ) {
      pendingList
        .slice(0, MAX_ARTICLE_LIST_SPACE - liveArticles.length)
        .forEach((article) => {
          const {
            url, title, description = '', image, favicon,
          } = article;

          addArticle({
            url,
            title,
            description,
            image,
            favicon,
          });
          removePendingList(article);
        });
      willreadToast.showSimple(
        '대기 목록에 있던 아티클이 자동으로 추가되었어요.',
      );
    }

    const displayItems: DisplayItem[] = liveArticles.map((article) => {
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
        timeLeft: calculateTimeLeft(article.expiredAt),
        isSetNotification,
        notificationTagType,
      };
    });

    Notifications.setBadgeCountAsync(badgeCount);
    return displayItems;
  }, [
    articles,
    pendingList,
    removeArticle,
    addArticle,
    removePendingList,
    scheduledNotifications,
  ]);

  return {
    articles,
    articleDraft,
    lastAddedArticle,
    scheduledNotifications,
    pendingList,
    isArticleFull,
    isPendingListFull,
    addArticle,
    removeArticle,
    addScheduledNotification,
    removeScheduledNotification,
    setLastReadAt,
    resetLastReadAt,
    readArticle,
    getDisplayItems,
    removePendingList,
  };
}

export default useArticle;
