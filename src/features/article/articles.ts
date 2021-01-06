/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import articles from '../../data/articles';

export interface Article {
  id: string;
  url: string;
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  createdAt: string;
  read: boolean;
}

export interface ArticleDraft {
  url: string;
  title: string;
  description: string;
  image?: string;
  favicon?: string;
}

export interface InitialState {
  articles: Article[];
  lastAddedArticle?: Article;
  articleDraft: ArticleDraft;
}

const defaultArticleDraft = () => ({
  url: '',
  title: '',
  description: '',
});

const initialState: InitialState = {
  articles,
  articleDraft: defaultArticleDraft(),
};

const slice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    addArticle: (state, action: PayloadAction<ArticleDraft>) => {
      const article: Article = {
        ...action.payload,
        id: nanoid(),
        createdAt: dayjs().format(),
        read: false,
      };
      state.articles.push(article);
      state.lastAddedArticle = article;
    },
    removeArticle: (state, action: PayloadAction<Article>) => {
      state.articles.splice(
        state.articles.findIndex((article) => article.id === action.payload.id),
        1,
      );
    },
    updateArticle: (state, action: PayloadAction<{id: string; article: Article}>) => {
      state.articles = state.articles.map((article) => {
        if (article.id === action.payload.id) {
          return {
            ...article,
            ...action.payload,
          };
        }
        return article;
      });
    },
  },
});
export default slice.reducer;

export const {
  addArticle,
  removeArticle,
  updateArticle,
} = slice.actions;
