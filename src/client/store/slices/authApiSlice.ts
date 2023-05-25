import { apiSlice } from "../apiSlice";
import type {
  LoginUserBody,
  LoginUserResponse,
  RefreshUserResponse,
  RegistrationUserBody,
  RegistrationUserResponse,
} from "../../../server/controllers/authController";
import { invalidateOnSuccess } from "../helpers/rtkQueryCacheUtils";

export const authApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    registration: build.mutation<
      RegistrationUserResponse,
      RegistrationUserBody
    >({
      query: (body) => ({ url: "user/registration", method: "POST", body }),
      invalidatesTags: invalidateOnSuccess(["AUTHORIZED"]),
    }),
    login: build.mutation<LoginUserResponse, LoginUserBody>({
      query: (body) => ({ url: "user/login", method: "POST", body }),
      invalidatesTags: invalidateOnSuccess(["AUTHORIZED"]),
    }),
    reLogin: build.query<RefreshUserResponse, void>({
      query: () => "user/refresh",
      providesTags: ["RE_AUTH"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(authApiSlice.util.invalidateTags(["AUTHORIZED"]));
        } catch {
          /* empty */
        }
      },
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: "user/logout", method: "POST" }),
      invalidatesTags: ["AUTHORIZED", "RE_AUTH"],
    }),
  }),
});

export const {
  useLoginMutation,
  useReLoginQuery,
  useLogoutMutation,
  useRegistrationMutation,
} = authApiSlice;
