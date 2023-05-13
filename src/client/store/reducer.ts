import { userSliceReducer } from "./slices/userSlice";
import { apiSlice } from "./apiSlice";

export default {
  user: userSliceReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
};
