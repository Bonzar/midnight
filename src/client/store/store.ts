import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import reducer from "./reducer";

export const createStore = (preloadedState?: object) => {
  const store = configureStore({
    reducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  if (import.meta.hot) {
    import.meta.hot.accept(["./reducer.ts", "./apiSlice.ts"], ([mod]) => {
      if (!mod) return;
      store.replaceReducer(combineReducers(mod.default as typeof reducer));
    });
    // import.meta.hot.accept("./apiSlice.ts", (mod) => {
    //   if (!mod) return;
    //   const newApiSlice = mod.default as typeof apiSlice;
    //   store.replaceReducer(
    //     combineReducers({
    //       ...reducer,
    //       [newApiSlice.reducerPath]: newApiSlice.reducer,
    //     })
    //   );
    // });
  }

  return store;
};

export type AppStore = ReturnType<typeof createStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
