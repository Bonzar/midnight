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

export type AllAsString<T> = {
  [N in keyof T]: string;
};

export type NotUndefined<T> = { [k in keyof T]-?: Exclude<T[k], undefined> };
