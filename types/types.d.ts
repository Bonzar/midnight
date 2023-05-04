import type { RootState } from "../src/client/store";
import type { UserJwtPayload } from "../src/server/services/userService";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_NAME: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      JWT_SECRET: string;
    }
  }

  interface Window {
    __PRELOADED_STATE__?: RootState;
  }

  namespace Express {
    export interface Request {
      user: UserJwtPayload;
    }
  }
}

export type AllAsString<T> = {
  [N in keyof T]: string;
};

export type NotUndefined<T> = { [k in keyof T]-?: Exclude<T[k], undefined> };
