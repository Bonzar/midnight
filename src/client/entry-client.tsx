import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { createStore } from "./store";
import { Provider as ReduxProvider } from "react-redux";

const container = document.getElementById("app");

const store = createStore(
  window.__PRELOADED_STATE__ // passed directly for garbage-collector
);
delete window.__PRELOADED_STATE__; // Allow the passed state to be garbage-collected

const FullApp = () => (
  <React.StrictMode>
    <ReduxProvider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReduxProvider>
  </React.StrictMode>
);

if (import.meta.hot || !container?.innerText) {
  const root = createRoot(container!);
  root.render(<FullApp />);
} else {
  hydrateRoot(container!, <FullApp />);
}
