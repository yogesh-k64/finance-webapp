import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import type { Handout } from '../utils/interface';

interface HandoutsState {
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
    removeHandout: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('handouts', JSON.stringify(state));
    }
  },
});

export const { addHandout, removeHandout } = handoutsSlice.actions;

export const useHandoutsList = (state: RootState) => state.handouts.items;

export default handoutsSlice.reducer;