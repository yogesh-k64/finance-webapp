import { createSlice } from "@reduxjs/toolkit";

interface RefreshSliceProps {
  refreshUsers: boolean;
  refreshHandouts: boolean;
  refreshCollections: boolean;
}

const initialState: RefreshSliceProps = {
  refreshCollections: false,
  refreshHandouts: false,
  refreshUsers: false,
};

const refreshSlice = createSlice({
  name: "refreshReducer",
  initialState,
  reducers: {
    storeRefreshUser: (state, action) => {
      state.refreshUsers = action.payload;
    },
  },
});

export const { storeRefreshUser } = refreshSlice.actions;

export const useRefreshUsers = (state: { refreshStore: RefreshSliceProps }) =>
  state.refreshStore.refreshUsers;

export default refreshSlice.reducer;
