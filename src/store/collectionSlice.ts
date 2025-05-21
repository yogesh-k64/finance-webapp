import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_KEY } from '../utils/constants';
import type { RootState } from './store';
import type { collection } from '../utils/interface';

export interface collectionState {
  items: collection[];
}

const defaultInitValue = {
  items: []
}

const loadFromLocalStorage = (): collectionState => {
  try {
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY.COLLECTION);
    if (serializedState === null) return defaultInitValue;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Failed to load handouts from localStorage', e);
    return defaultInitValue;
  }
};

const initialState: collectionState = loadFromLocalStorage();

export const collectionSlice = createSlice({
  name: 'collectionSlice',
  initialState,
  reducers: {
    addCollection: (state, action: PayloadAction<collection>) => {
      state.items.push(action.payload);
      localStorage.setItem(LOCAL_STORAGE_KEY.COLLECTION, JSON.stringify(state));
    },
    removeCollection: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem(LOCAL_STORAGE_KEY.COLLECTION, JSON.stringify(state));
    },
    loadCollection: (state, action: PayloadAction<collectionState>) => {
      state = action.payload;
      localStorage.setItem(LOCAL_STORAGE_KEY.COLLECTION, JSON.stringify(state));
    }
  },
});

export const { addCollection, removeCollection, loadCollection } = collectionSlice.actions;

export const useCollectionList = (state: RootState) => state.collection.items;

export default collectionSlice.reducer;