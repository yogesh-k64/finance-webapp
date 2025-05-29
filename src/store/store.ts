import AppConfigReducer from './AppConfigReducer';
import collectionReducer from './collectionSlice';
import { configureStore } from '@reduxjs/toolkit';
import handoutsReducer from './handoutsSlice';

export const store = configureStore({
  reducer: {
    handouts: handoutsReducer,
    collection: collectionReducer,
    AppConfigReducer: AppConfigReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;