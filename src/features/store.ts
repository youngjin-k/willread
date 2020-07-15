import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';
import homeCategoryFiltersReducer from './homeCategoryFilters';
import articlesReducer from './articles';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whiteList: [],
};

const reducer = combineReducers({
  articles: articlesReducer,
  homeCategoryFilters: homeCategoryFiltersReducer,
});

// const persistedReducer = persistReducer(persistConfig, reducer);

export type RootState = ReturnType<typeof reducer>;

const store = configureStore({
  reducer,
  // middleware: getDefaultMiddleware({
  //   serializableCheck: {
  //     ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //   },
  // }),
});

// export const persistor = persistStore(store);

export default store;
