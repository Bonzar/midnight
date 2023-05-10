import type { AppStore } from "../store";
import React from "react";
import { createRoutesFromElements, Route } from "react-router-dom";
import { App, appLoader } from "../App";
import { Login } from "../pages/Login/Login";

export const getRoutes = (store: AppStore) =>
  createRoutesFromElements(
    <Route path="/" loader={appLoader(store)} element={<App />}>
      <Route index element={<Login />} />
    </Route>
  );
