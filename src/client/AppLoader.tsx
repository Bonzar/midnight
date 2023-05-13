import { createLoader } from "./routes/createLoader";
// import { authApiSlice } from "./store/slices/authApiSlice";
// import { defer } from "react-router-dom";

export const appLoader = createLoader((store) => async ({ request }) => {
  // skip fetching on server
  // if (import.meta.env.SSR) return null;
  //
  // const authPromise = store.dispatch(authApiSlice.endpoints.reLogin.initiate());
  // request.signal.onabort = authPromise.abort;
  // authPromise.unsubscribe();
  //
  // const unwrappedPostsPromise = authPromise.unwrap();

  // return defer({ posts: unwrappedPostsPromise });
  return null;
});
