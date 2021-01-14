import AsyncStorage from '@react-native-community/async-storage';
import { combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';

import articlesReducer from './article/articles';
import homeCategoryFiltersReducer from './homeCategoryFilters';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whiteList: [],
};

const reducer = combineReducers({
  articles: articlesReducer,
  homeCategoryFilters: homeCategoryFiltersReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export type RootState = ReturnType<typeof reducer>;

const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export default store;
