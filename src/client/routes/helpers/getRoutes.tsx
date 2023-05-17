import type { AppStore } from "../../store";
import type { RouteObject } from "react-router-dom";
import { routes } from "../routes";

export const getRoutes = (
  store: AppStore,
  reRenderCallback?: (routes: RouteObject[]) => void
) => {
  if (import.meta.hot) {
    import.meta.hot.accept((modGetRoutes) => {
      reRenderCallback?.(modGetRoutes?.getRoutes(store, reRenderCallback));
    });
  }

  return routes(store);
};
