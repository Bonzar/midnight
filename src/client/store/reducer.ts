import { userSliceReducer } from "./slices/userSlice";
import { imageCacheSliceReducer } from "./slices/imageCacheSlice";
import { apiSlice } from "./apiSlice";

export default {
  user: userSliceReducer,
  imageCache: imageCacheSliceReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
};
