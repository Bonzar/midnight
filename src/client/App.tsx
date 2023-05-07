import React from "react";
import "the-new-css-reset/css/reset.css";
import "./assets/styles/main.global.css";
import { Layout } from "./components/Layout";
import { Outlet } from "react-router-dom";

export const App = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
