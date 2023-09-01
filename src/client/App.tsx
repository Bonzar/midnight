import React from "react";
import "the-new-css-reset/css/reset.css";
import "./assets/styles/main.global.css";
import { Layout } from "./components/Layout";
import { Outlet } from "react-router-dom";
import { useReLogin } from "./hooks/useReLogin";

export const App = () => {
  useReLogin();

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
