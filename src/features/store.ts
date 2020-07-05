import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import homeCategoryFiltersReducer from './homeCategoryFilters';
import articlesReducer from './articles';

const reducer = combineReducers({
  articles: articlesReducer,
  homeCategoryFilters: homeCategoryFiltersReducer,
});

export type RootState = ReturnType<typeof reducer>;

const store = configureStore({
  reducer,
});

export default store;
