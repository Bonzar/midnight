import { apiSlice } from "../apiSlice";
import type {
  LoginUserBody,
  LoginUserResponse,
  RefreshUserResponse,
  RegistrationUserBody,
  RegistrationUserResponse,
} from "../../../server/controllers/authController";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    registration: build.mutation<
      RegistrationUserResponse,
      RegistrationUserBody
    >({
      query: (body) => ({ url: "user/registration", method: "POST", body }),
    }),
    login: build.mutation<LoginUserResponse, LoginUserBody>({
      query: (body) => ({ url: "user/login", method: "POST", body }),
    }),
    reLogin: build.query<RefreshUserResponse, void>({
      query: () => "user/refresh",
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: "user/logout", method: "POST" }),
    }),
  }),
});

export const {
  useLoginMutation,
  useReLoginQuery,
  useLogoutMutation,
  useRegistrationMutation,
} = authApiSlice;
