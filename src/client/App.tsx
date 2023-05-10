import React from "react";
import "the-new-css-reset/css/reset.css";
import "./assets/styles/main.global.css";
import { Layout } from "./components/Layout";
import { defer, Outlet } from "react-router-dom";
import { authApiSlice, useReLoginQuery } from "./store/slices/authApiSlice";
import { createLoader } from "./routes/createLoader";

export const appLoader = createLoader((store) => async ({ request }) => {
  // skip fetching on server
  if (import.meta.env.SSR) {
    return null;
  }

  const authPromise = store.dispatch(authApiSlice.endpoints.reLogin.initiate());
  request.signal.onabort = authPromise.abort;
  authPromise.unsubscribe();

  const unwrappedPostsPromise = authPromise.unwrap();

  return defer({ posts: unwrappedPostsPromise });
});

export const App = () => {
  useReLoginQuery();

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
