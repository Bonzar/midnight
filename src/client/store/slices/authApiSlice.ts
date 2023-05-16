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
      invalidatesTags: ["Basket"],
    }),
    login: build.mutation<LoginUserResponse, LoginUserBody>({
      query: (body) => ({ url: "user/login", method: "POST", body }),
      invalidatesTags: ["Basket"],
    }),
    reLogin: build.query<RefreshUserResponse, void>({
      query: () => "user/refresh",
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: "user/logout", method: "POST" }),
      invalidatesTags: ["Basket"],
    }),
  }),
});

export const {
  useLoginMutation,
  useReLoginQuery,
  useLogoutMutation,
  useRegistrationMutation,
} = authApiSlice;
