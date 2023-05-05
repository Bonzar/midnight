import type { RootState } from "../src/client/store";
import type { UserDto } from "../src/server/dtos/userDto";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_NAME: string;
      DB_USERNAME: string;
      DB_PASSWORD: string;
      DB_HOST: string;
      JWT_ACCESS_SECRET: string;
      JWT_REFRESH_SECRET: string;
      SMTP_HOST: string;
      SMTP_PORT: string;
      SMTP_USER: string;
      SMTP_PASSWORD: string;
      API_URL: string;
    }
  }

  interface Window {
    __PRELOADED_STATE__?: RootState;
  }

  namespace Express {
    export interface Request {
      user: UserDto;
    }
  }
}

export type AllAsString<T> = {
  [N in keyof T]: string;
};

export type NotUndefined<T> = { [k in keyof T]-?: Exclude<T[k], undefined> };
