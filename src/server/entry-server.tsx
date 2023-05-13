import React from "react";
import "./helpers/fetch-polyfill";
import { createFetchRequest } from "./helpers/createFetchRequest";
import ReactDOMServer from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";
import type { StaticHandlerContext } from "react-router-dom/server";
import { createStore } from "../client/store";
import { Provider as ReduxProvider } from "react-redux";
import { getRoutes } from "../client/routes/getRoutes";
import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from "express";

export async function render(
  req: ExpressRequest,
  res: ExpressResponse,
  template: string
) {
  const store = createStore();

  // Turn Express request to Fetch
  const fetchRequest = await createFetchRequest(req);
  // Create handler with routes connected to store
  const handler = createStaticHandler(getRoutes(store));

  // Do all initial work(load data) for corresponding route
  let context;
  try {
    context = await handler.query(fetchRequest);
  } catch (error: any) {
    if (error.message === "query() call aborted") {
      // skip error that caused by aborting request from client while page load (e.g., early reload)
      return;
    }
    throw error;
  }

  // Redirect on server if redirect was in react
  if (
    context instanceof Response &&
    [301, 302, 303, 307, 308].includes(context.status)
  ) {
    const location = context.headers.get("Location");
    if (!location) return;

    return res.status(context.status).redirect(location);
  }

  const router = createStaticRouter(
    handler.dataRoutes,
    context as StaticHandlerContext
  );

  const appHtml = ReactDOMServer.renderToString(
    <React.StrictMode>
      <ReduxProvider store={store}>
        <StaticRouterProvider
          router={router}
          context={context as StaticHandlerContext}
        />
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
