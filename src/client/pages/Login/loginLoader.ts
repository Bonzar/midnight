import { createLoader } from "../../routes/helpers/createLoader";
import { selectUser } from "../../store/slices/userSlice";
import { redirect } from "react-router-dom";

export const loginLoader = createLoader((store) => () => {
  const currentUser = selectUser(store.getState());

  if (currentUser.isAuth && currentUser.data?.role !== "GUEST") {
    return redirect("/profile");
  }

  return null;
});
