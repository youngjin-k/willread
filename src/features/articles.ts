/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import articles from '../data/articles';
import { CategoryColors } from './homeCategoryFilters';

export interface Article {
  id: string;
  uri: string;
  title: string;
  description?: string;
  imageUri?: string;
  categoryColor: CategoryColors;
  minutesToRead: number;
}

export interface ArticleDraft {
  uri: string;
  title: string;
  description?: string;
  imageUri?: string;
  categoryColor: CategoryColors;
  minutesToRead: number;
}

export interface InitialState {
  articles: Article[];
}

const initialState: InitialState = {
  articles,
};

const slice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    addArticle: (state, action: PayloadAction<ArticleDraft>) => {
      const article: Article = {
        ...action.payload,
        id: String(state.articles.length + 1),
      };
      state.articles.push(article);
    },
  },
});
export default slice.reducer;

export const {
  addArticle,
} = slice.actions;
