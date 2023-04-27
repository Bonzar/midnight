import "./fetch-polyfill";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { App } from "../client/App";
import { createStore } from "../client/store";
import { Provider as ReduxProvider } from "react-redux";

export function render(template: string, url: string) {
  const store = createStore();

  const appHtml = ReactDOMServer.renderToString(
    <React.StrictMode>
      <ReduxProvider store={store}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </ReduxProvider>
    </React.StrictMode>
  );

  const preloadedState = store.getState();

  const injectInitialState = `<script>
      // WARNING: See the following for security issues around embedding JSON in HTML:
      // https://redux.js.org/usage/server-rendering#security-considerations
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
        /</g,
        "\\u003c"
      )}
    </script>`;

  // 5. Inject the app-rendered HTML into the template.
  return template
    .replace(`<!--app-html-->`, appHtml)
    .replace(`<!--app-init-store-->`, injectInitialState);
}
