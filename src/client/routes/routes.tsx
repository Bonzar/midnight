import React from "react";
import type { AppStore } from "../store";
import { App } from "../App";
import { Login } from "../pages/Login/Login";
import { createRoutesFromElements, Route } from "react-router-dom";

export const routes = (store: AppStore) =>
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Login />} />
      <Route path="login" element={<Login />} />
    </Route>
  );
