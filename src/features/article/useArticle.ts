import { useDispatch, useSelector } from 'react-redux';
import * as Notifications from 'expo-notifications';
import { useCallback } from 'react';
import dayjs from 'dayjs';
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

  const setRead = (article: Article, read = true) => {
    dispatch(
      updateArticle({
        id: article.id,
        article: { ...article, read },
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

  return {
    articles,
    articleDraft,
    lastAddedArticle,
    scheduledNotifications,
    addArticle: (draft: ArticleDraft) => dispatch(addArticle(draft)),
    removeArticle,
    addScheduledNotification,
    removeScheduledNotification,
    setRead,
  };
}

export default useArticle;
