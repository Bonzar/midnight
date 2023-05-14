import type { AppStore } from "../store";
import type { LoaderFunctionArgs, Params } from "react-router-dom";
import type { ExtendableProps } from "../components/types/PolymorphicComponent";

export type LoaderArgs<ParamKey extends string = string> = ExtendableProps<
  LoaderFunctionArgs,
  Record<"params", Params<ParamKey>>
>;

export const createLoader =
  <T>(connectedLoader: (store: AppStore) => (loaderArgs: LoaderArgs) => T) =>
  (store: AppStore) =>
    connectedLoader(store);
