import React from "react";
import type { AppStore } from "../store";
import { App } from "../App";
import { appLoader } from "../AppLoader";
import { Login } from "../pages/Login/Login";
import { createRoutesFromElements, Route } from "react-router-dom";

export const routes = (store: AppStore) =>
  createRoutesFromElements(
    <Route path="/" loader={appLoader(store)} element={<App />}>
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
    </Route>
  );
