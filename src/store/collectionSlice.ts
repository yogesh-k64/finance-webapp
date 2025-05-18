import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { LOCAL_STORAGE_KEY } from '../utils/constants';
import type { RootState } from './store';
import type { collection } from '../utils/interface';
import { getCollectionSummary } from '../utils/utilsFunction';



interface collectionState {
  items: collection[];
  collectionSummary: {
    total: number
  }
}

const defaultInitValue = {
  items: [],
  collectionSummary: {
    total: 0
  }
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
      state.collectionSummary = getCollectionSummary(state.items)
      localStorage.setItem(LOCAL_STORAGE_KEY.COLLECTION, JSON.stringify(state));
    },
    removeCollection: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem(LOCAL_STORAGE_KEY.COLLECTION, JSON.stringify(state));
    }
  },
});

export const { addCollection, removeCollection } = collectionSlice.actions;

export const useCollectionList = (state: RootState) => state.collection.items;
export const useCollectionSummary = (state: RootState) => state.collection.collectionSummary;

export default collectionSlice.reducer;