import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { HandoutRespClass } from "../responseClass/HandoutResp";

export interface HandoutsState {
  items: HandoutRespClass[];
}

const initialState: HandoutsState = {
  items: [],
};

export const handoutsSlice = createSlice({
  name: "handouts",
  initialState,
  reducers: {
    setHandouts: (state, action: PayloadAction<HandoutRespClass[]>) => {
      state.items = action.payload;
    },
    clearHandouts: (state) => {
      state.items = [];
    },
  },
});

export const { setHandouts, clearHandouts } =
  handoutsSlice.actions;

export const useHandoutsList = (state: RootState) => state.handouts.items;

export default handoutsSlice.reducer;
