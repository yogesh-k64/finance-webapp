import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserClass } from "../responseClass/UserClass";

interface UsersState {
  items: UserClass[];
}

const initialState: UsersState = {
  items: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<UserClass[]>) => {
      state.items = action.payload;
    },
    clearUser: (state) => {
      state.items = [];
    },
  },
});

export const { setUsers, clearUser } = usersSlice.actions;

export const useUserList = (state: { users: UsersState }) => state.users.items;

export default usersSlice.reducer;
