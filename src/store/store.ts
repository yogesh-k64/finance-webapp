import AppConfigReducer from './AppConfigReducer';
import RefreshReducer from './RefreshReducer';
import collectionReducer from './collectionSlice';
import userReducer from './customerSlice';
import { configureStore } from '@reduxjs/toolkit';
import handoutsReducer from './handoutsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    handouts: handoutsReducer,
    collection: collectionReducer,
    users: userReducer,
    AppConfigReducer: AppConfigReducer,
    refreshStore: RefreshReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;