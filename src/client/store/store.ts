import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import { userSliceReducer } from "./slices/userSlice";

export const reducer = combineReducers({
  user: userSliceReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export const createStore = (preloadedState?: object) => {
  return configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });
};

export type AppStore = ReturnType<typeof createStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
