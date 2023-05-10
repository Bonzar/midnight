import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import * as process from "process";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.SSR ? process.env.VITE_API_URL : ""}/api/`,
    credentials: "same-origin",
    prepareHeaders: (headers) => {
      // no localStorage on server => exit
      if (import.meta.env.SSR) {
        return;
      }

      const accessToken = localStorage.getItem("token");
      if (accessToken) {
        headers.set("authorization", `Bearer ${accessToken}`);
      }
    },
  }),
  tagTypes: [],
  endpoints: () => ({}),
});
