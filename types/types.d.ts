import type { RootState } from "../src/client/store";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_NAME: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_HOST: string;
    }
  }
  interface Window {
    __PRELOADED_STATE__?: RootState;
  }
}
