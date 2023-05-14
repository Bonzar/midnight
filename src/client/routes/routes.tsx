import React from "react";
import type { AppStore } from "../store";
import { App } from "../App";
import { Login } from "../pages/Login";
import { Profile } from "../pages/Profile";
import { createRoutesFromElements, Route } from "react-router-dom";
import { loginLoader } from "../pages/Login/loginLoader";
import { Main } from "../pages/Main";
import { mainLoader } from "../pages/Main/mainLoader";
import { Product } from "../pages/Product";
import { productLoader } from "../pages/Product/productLoader";

export const routes = (store: AppStore) =>
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Main />} loader={mainLoader(store)} />
      <Route path="login" element={<Login />} loader={loginLoader(store)} />
      <Route path="profile" element={<Profile />} />
      <Route path="products">
        <Route path=":id" element={<Product />} loader={productLoader(store)} />
      </Route>
    </Route>
  );
