import type { AppStore } from "../store";
import React from "react";
import { createRoutesFromElements, Route } from "react-router-dom";
import { App } from "../App";
import { Login } from "../pages/Login/Login";
import { appLoader } from "../AppLoader";

export const getRoutes = (store: AppStore) =>
  createRoutesFromElements(
    <Route path="/" loader={appLoader(store)} element={<App />}>
      <Route index element={<Login />} />
    </Route>
  );
