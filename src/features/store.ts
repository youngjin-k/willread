import AsyncStorage from '@react-native-community/async-storage';
import { combineReducers, createStore } from 'redux';
import {
  persistReducer, persistStore,
} from 'redux-persist';

import articlesReducer from './article/articles';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
};

const reducer = combineReducers({
  articles: articlesReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export type RootState = ReturnType<typeof reducer>;

const store = createStore(persistedReducer);
export const persistor = persistStore(store);

export default store;
