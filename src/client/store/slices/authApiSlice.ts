import { apiSlice } from "../apiSlice";
import type {
  LoginUserBody,
  LoginUserResponse,
  RefreshUserResponse,
  RegistrationUserBody,
  RegistrationUserResponse,
} from "../../../server/controllers/authController";
import { invalidatesUnauthorized } from "../helpers/rtkQueryCacheUtils";

export const authApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    registration: build.mutation<
      RegistrationUserResponse & {
        some: { nested: { prop: { id: number }[] } };
      },
      RegistrationUserBody
    >({
      query: (body) => ({ url: "user/registration", method: "POST", body }),
      invalidatesTags: invalidatesUnauthorized(["AUTHORIZED"]),
    }),
    login: build.mutation<LoginUserResponse, LoginUserBody>({
      query: (body) => ({ url: "user/login", method: "POST", body }),
      invalidatesTags: invalidatesUnauthorized(["AUTHORIZED"]),
    }),
    reLogin: build.query<RefreshUserResponse, void>({
      query: () => "user/refresh",
      providesTags: ["AUTHORIZED"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
          dispatch(authApiSlice.util.invalidateTags(["UNAUTHORIZED"]));
        } catch {
          /* empty */
        }
      },
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: "user/logout", method: "POST" }),
      invalidatesTags: ["AUTHORIZED"],
    }),
  }),
});

export const {
  useLoginMutation,
  useReLoginQuery,
  useLogoutMutation,
  useRegistrationMutation,
} = authApiSlice;
