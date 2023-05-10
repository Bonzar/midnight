import type { AppStore } from "../store";
import type { LoaderFunctionArgs } from "react-router-dom";

export const createLoader =
  <P>(connectedLoader: (store: AppStore) => (args: LoaderFunctionArgs) => P) =>
  (store: AppStore) =>
    connectedLoader(store);
