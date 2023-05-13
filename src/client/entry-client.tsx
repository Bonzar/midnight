import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import type { RouteObject } from "react-router-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { createStore } from "./store";
import { Provider as ReduxProvider } from "react-redux";
import { getRoutes } from "./routes/getRoutes";

const container = document.getElementById("app");

const store = createStore(
  window.__PRELOADED_STATE__ // passed directly for garbage-collector
);
delete window.__PRELOADED_STATE__; // Allow the passed state to be garbage-collected

const getFullApp = (routes: RouteObject[]) => (
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={createBrowserRouter(routes)} />
    </ReduxProvider>
  </React.StrictMode>
);

// enable HMR for router in DEV mode
if (import.meta.env.DEV && import.meta.hot) {
  // always will client render
  const reactRoot = createRoot(container!);

  // function that will render updated app
  const renderApp = (routes: RouteObject[]) => {
    reactRoot.render(getFullApp(routes));
  };

  // get routes with passing callback for rerender on hmr change accept
  const routes = getRoutes(store, renderApp);

  // render app first time
  renderApp(routes);
} else {
  // render without (only router) HMR
  hydrateRoot(container!, getFullApp(getRoutes(store)));
}
