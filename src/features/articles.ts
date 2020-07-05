/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../components/RecommendCard';
import articles from '../data/articles';

export interface InitialState {
  articles: Article[];
}

const initialState: InitialState = {
  articles: [],
};

const slice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    addArticle: (state, action: PayloadAction<Article>) => {
      state.articles.push(action.payload);
    },
  },
});
export default slice.reducer;

export const {
  addArticle,
} = slice.actions;
