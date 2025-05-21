import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { collection, Handout } from '../utils/interface';

export interface HandoutsState {
  items: Handout[]
}

const defaultInitValue = {
  items: []
}

const loadFromLocalStorage = (): HandoutsState => {
  try {
    const serializedState = localStorage.getItem('handouts');
    if (serializedState === null) return defaultInitValue
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Failed to load handouts from localStorage', e);
    return defaultInitValue
  }
};

const initialState: HandoutsState = loadFromLocalStorage()


export const handoutsSlice = createSlice({
  name: 'handouts',
  initialState,
  reducers: {
    addHandout: (state, action: PayloadAction<Handout>) => {
      state.items.push(action.payload);
      localStorage.setItem('handouts', JSON.stringify(state));
    },
    addCollectionToHandout: (state, action: PayloadAction<{ id: string, colItem: collection }>) => {
      const { colItem, id } = action.payload;
      state.items = state.items.map(item => {
        if (item.id === id) {
          item.collection.push(colItem);
        }
        return item;
      });
      localStorage.setItem('handouts', JSON.stringify(state));
    },
    removeHandout: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('handouts', JSON.stringify(state));
    },
    loadHandouts: (state, action: PayloadAction<HandoutsState>) => {
      state = action.payload;
      localStorage.setItem('handouts', JSON.stringify(state));
    }
  },
});

export const { addHandout, removeHandout, loadHandouts } = handoutsSlice.actions;

export const useHandoutsList = (state: RootState) => state.handouts.items;

export default handoutsSlice.reducer;