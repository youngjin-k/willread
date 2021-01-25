/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import dayjs from 'dayjs';

export interface Article {
  id: string;
  url: string;
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  createdAt: string;
  lastReadAt?: string;
  expiredAt: string;
}

export interface ArticleDraft {
  url: string;
  title: string;
  description: string;
  image?: string;
  favicon?: string;
}

export interface ScheduledNotification {
  id: string;
  articleId: string;
  date: string;
}

export interface InitialState {
  articles: Article[];
  lastAddedArticle?: Article;
  articleDraft: ArticleDraft;
  scheduledNotifications: ScheduledNotification[];
  pendingList: Article[];
}

const defaultArticleDraft = () => ({
  url: '',
  title: '',
  description: '',
});

const initialState: InitialState = {
  articles: [],
  articleDraft: defaultArticleDraft(),
  scheduledNotifications: [],
  pendingList: [],
};

const slice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    addArticle: (state, action: PayloadAction<ArticleDraft>) => {
      const now = dayjs();
      const article: Article = {
        ...action.payload,
        id: nanoid(),
        createdAt: now.format(),
        expiredAt: now.add(7, 'day').format(),
      };
      state.articles.push(article);
      state.lastAddedArticle = article;
    },
    removeArticle: (state, action: PayloadAction<Article>) => {
      state.articles = state.articles.filter(
        (article) => article.id !== action.payload.id,
      );
    },
    updateArticle: (
      state,
      action: PayloadAction<{ id: string; article: Article }>,
    ) => {
      state.articles = state.articles.map((article) => {
        if (article.id === action.payload.id) {
          return {
            ...article,
            ...action.payload.article,
          };
        }
        return article;
      });
    },
    addScheduledNotification: (
      state,
      action: PayloadAction<ScheduledNotification>,
    ) => {
      state.scheduledNotifications.push(action.payload);
    },
    removeScheduledNotification: (state, action: PayloadAction<string>) => {
      state.scheduledNotifications = state.scheduledNotifications.filter(
        (scheduledNotification) => scheduledNotification.id !== action.payload,
      );
    },
    addPendingList: (state, action: PayloadAction<ArticleDraft>) => {
      const now = dayjs();
      const article: Article = {
        ...action.payload,
        id: nanoid(),
        createdAt: now.format(),
        expiredAt: now.add(1, 'day').format(),
      };
      state.pendingList.push(article);
      state.lastAddedArticle = article;
    },
    DEVforceUpdateArticles: (state, action: PayloadAction<Article[]>) => {
      state.articles = action.payload;
    },
  },
});
export default slice.reducer;

export const {
  addArticle,
  removeArticle,
  updateArticle,
  addScheduledNotification,
  removeScheduledNotification,
  addPendingList,
  DEVforceUpdateArticles,
} = slice.actions;
