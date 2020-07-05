/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum CategoryColors {
  DEFAULT = 'default',
  RED = 'red',
  BLUE = 'blue',
  ORANGE = 'orange',
  GREEN = 'green',
  YELLOW = 'yellow',
  PINK = 'pink'
}

export interface InitialState {
  filters: {
    category: CategoryColors;
  }
}

const initialState: InitialState = {
  filters: {
    category: CategoryColors.DEFAULT,
  },
};

const slice = createSlice({
  name: 'homeCategoryFilters',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<CategoryColors>) => {
      state.filters.category = action.payload;
    },
  },
});
export default slice.reducer;

export const {
  setCategory,
} = slice.actions;
