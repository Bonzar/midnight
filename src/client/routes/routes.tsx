import React from "react";
import type { AppStore } from "../store";
import { App } from "../App";
import { Login } from "../pages/Login";
import { Profile } from "../pages/Profile";
import { createRoutesFromElements, Route } from "react-router-dom";
import { loginLoader } from "../pages/Login/loginLoader";
import { Main } from "../pages/Main";

export const routes = (store: AppStore) =>
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Main />} />
      <Route path="login" element={<Login />} loader={loginLoader(store)} />
      <Route path="profile" element={<Profile />} />
    </Route>
  );
