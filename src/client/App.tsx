import React from "react";
import "the-new-css-reset/css/reset.css";
import "./assets/styles/main.global.css";
import { Layout } from "./components/Layout";
import { Outlet } from "react-router-dom";
import { useReLoginQuery } from "./store/slices/authApiSlice";

export const App = () => {
  const isNoToken = import.meta.env.SSR || !localStorage.getItem("token");
  useReLoginQuery(undefined, { skip: isNoToken });

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
