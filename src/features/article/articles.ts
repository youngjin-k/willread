/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import articles from '../../data/articles';
import { CategoryColors } from '../homeCategoryFilters';

export interface Article {
  id: string;
  uri: string;
  title: string;
  description?: string;
  image?: string;
  favicon?: string;
  categoryColor: CategoryColors;
  minutesToRead: number;
}

export interface ArticleDraft {
  uri: string;
  title: string;
  description: string;
  image?: string;
  favicon?: string;
  categoryColor: CategoryColors;
  minutesToRead: number;
}

export interface InitialState {
  articles: Article[];
  lastAddedArticle?: Article;
  articleDraft: ArticleDraft;
}

const defaultArticleDraft = () => ({
  uri: 'https://blog.logrocket.com/caching-clash-useswr-vs-react-query/',
  title: '',
  description: '',
  categoryColor: CategoryColors.RED,
  minutesToRead: -1,
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
    updateArticle: (state, action: PayloadAction<{id: string, article: Article}>) => {
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
    setArticleDraft: (state, action: PayloadAction<ArticleDraft>) => {
      state.articleDraft = action.payload;
    },
  },
});
export default slice.reducer;

export const {
  addArticle,
  removeArticle,
  updateArticle,
  setArticleDraft,
} = slice.actions;
