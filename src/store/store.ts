import { configureStore } from '@reduxjs/toolkit';
import handoutsReducer from './handoutsSlice';

export const store = configureStore({
  reducer: {
    handouts: handoutsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;