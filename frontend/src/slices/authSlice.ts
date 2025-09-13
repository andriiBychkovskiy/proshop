import { createSlice } from "@reduxjs/toolkit";
import type { UserType } from "../../../shared/interface";

// User info type without password (for storing in state/localStorage)
type UserInfo = Omit<UserType, "password">;

interface UserInterface {
  userInfo: UserInfo | null;
}

const initialState: UserInterface = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});
export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
