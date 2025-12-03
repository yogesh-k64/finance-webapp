import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { CollectionClass } from "../responseClass/CollectionClass";

export interface collectionState {
  items: CollectionClass[];
}

const defaultInitValue = {
  items: [],
};

const initialState: collectionState = defaultInitValue;

export const collectionSlice = createSlice({
  name: "collectionSlice",
  initialState,
  reducers: {
    setCollections: (state, action: PayloadAction<CollectionClass[]>) => {
      state.items = action.payload;
    },
    clearCollections: (state) => {
      state.items = [];
    },
  },
});

export const { setCollections, clearCollections } = collectionSlice.actions;

export const useCollectionList = (state: RootState) => state.collection.items;

export default collectionSlice.reducer;
