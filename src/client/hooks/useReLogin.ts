import { useReLoginQuery } from "../store/slices/authApiSlice";

export const useReLogin = () => {
  const isNoToken = import.meta.env.SSR || !localStorage.getItem("token");
  return useReLoginQuery(undefined, {
    skip: isNoToken,
  });
};
