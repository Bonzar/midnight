import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { createStore } from "./store";
import { Provider as ReduxProvider } from "react-redux";
import { getRoutes } from "./routes";

const container = document.getElementById("app");

const store = createStore(
  window.__PRELOADED_STATE__ // passed directly for garbage-collector
);
delete window.__PRELOADED_STATE__; // Allow the passed state to be garbage-collected

const router = createBrowserRouter(getRoutes(store));

const FullApp = () => (
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  </React.StrictMode>
);

if (import.meta.hot || !container?.innerText) {
  const root = createRoot(container!);
  root.render(<FullApp />);
} else {
  hydrateRoot(container!, <FullApp />);
}
