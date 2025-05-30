import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Handout } from '../utils/interface';

interface HandoutsState {
  items: Handout[];
}

// Load from localStorage on initial state
const loadFromLocalStorage = (): Handout[] => {
  try {
    const serializedState = localStorage.getItem('handouts');
    if (serializedState === null) return [];
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn('Failed to load handouts from localStorage', e);
    return [];
  }
};

const initialState: HandoutsState = {
  items: loadFromLocalStorage(),
};

export const handoutsSlice = createSlice({
  name: 'handouts',
  initialState,
  reducers: {
    addHandout: (state, action: PayloadAction<Handout>) => {
      state.items.push(action.payload);
      // Save to localStorage whenever we add a handout
      localStorage.setItem('handouts', JSON.stringify(state.items));
    },
    removeHandout: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      // Update localStorage after removal
      localStorage.setItem('handouts', JSON.stringify(state.items));
    },
    clearHandouts: (state) => {
      state.items = [];
      // Clear localStorage
      localStorage.removeItem('handouts');
    },
  },
});

export const { addHandout, removeHandout } = handoutsSlice.actions;
export default handoutsSlice.reducer;