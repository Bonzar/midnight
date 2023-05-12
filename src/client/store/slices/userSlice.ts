import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { IUserDto } from "../../../server/dtos/userDto";
import type { RootState } from "../store";
import { authApiSlice } from "./authApiSlice";

type UserState = {
  isAuth: boolean;
  data?: IUserDto;
};

const initialState: UserState = {
  isAuth: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
    setUser: (state, action: PayloadAction<IUserDto>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        authApiSlice.endpoints.registration.matchFulfilled,
        (state, { payload }) => {
          if (!import.meta.env.SSR) {
            localStorage.setItem("token", payload.accessToken);
          }
          state.data = payload.user;
          state.isAuth = true;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          if (!import.meta.env.SSR) {
            localStorage.setItem("token", payload.accessToken);
          }
          state.data = payload.user;
          state.isAuth = true;
        }
      )
      .addMatcher(
        authApiSlice.endpoints.reLogin.matchFulfilled,
        (state, { payload }) => {
          if (!import.meta.env.SSR) {
            localStorage.setItem("token", payload.accessToken);
          }
          state.data = payload.user;
          state.isAuth = true;
        }
      )
      .addMatcher(authApiSlice.endpoints.logout.matchFulfilled, () => {
        if (!import.meta.env.SSR) {
          localStorage.removeItem("token");
        }
        return {
          isAuth: false,
        };
      });
  },
});

export const { setIsAuth, setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export const userSliceReducer = userSlice.reducer;
