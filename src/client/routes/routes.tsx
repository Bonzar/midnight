import type { AppStore } from "../store";
import React from "react";
import { createRoutesFromElements, Route } from "react-router-dom";
import { App } from "../App";

// eslint-disable-next-line no-unused-vars
export const getRoutes = (store: AppStore) =>
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<App />} />
    </Route>
  );
