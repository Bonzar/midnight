import { apiSlice } from "../apiSlice";
import type {
  LoginUserBody,
  LoginUserResponse,
  RefreshUserResponse,
  RegistrationUserBody,
  RegistrationUserResponse,
} from "../../../server/controllers/authController";
import { toastApiError } from "../../utils/toastApiError";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    registration: build.mutation<
      RegistrationUserResponse,
      RegistrationUserBody
    >({
      query: (body) => ({ url: "user/registration", method: "POST", body }),
      invalidatesTags: ["Basket"],
      transformErrorResponse: toastApiError(),
    }),
    login: build.mutation<LoginUserResponse, LoginUserBody>({
      query: (body) => ({ url: "user/login", method: "POST", body }),
      invalidatesTags: ["Basket"],
      transformErrorResponse: toastApiError(),
    }),
    reLogin: build.query<RefreshUserResponse, void>({
      query: () => "user/refresh",
      transformErrorResponse: toastApiError(),
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: "user/logout", method: "POST" }),
      invalidatesTags: ["Basket"],
      transformErrorResponse: toastApiError(),
    }),
  }),
});

export const {
  useLoginMutation,
  useReLoginQuery,
  useLogoutMutation,
  useRegistrationMutation,
} = authApiSlice;
