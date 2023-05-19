import React, { useEffect } from "react";
import { useAppSelector } from "../../store/helpers/hooks";
import { selectUser } from "../../store/slices/userSlice";
import { Text } from "../../components/ui/Text";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Indent } from "../../components/ui/Indent";
import {
  useLogoutMutation,
  useReLoginQuery,
} from "../../store/slices/authApiSlice";

export const Profile = () => {
  const currentUser = useAppSelector(selectUser);
  const [logout] = useLogoutMutation();
  const { isLoading, isUninitialized } = useReLoginQuery();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUninitialized) {
      navigate("../login", { replace: true });
    }
  }, [navigate, isUninitialized]);

  if (isUninitialized || isLoading) {
    return null;
  }

  if (!currentUser.isAuth) {
    return (
      <>
        <Text as="div">Для просмотра профиля необходимо авторизоваться</Text>
        <Text as="div">
          Перейти на
          <Text to="/login" as={Link}>
            страницу входа
          </Text>
        </Text>
      </>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      /* show error from hook */
    }
  };

  if (!currentUser.data) {
    return <Text as="div">Нет данных пользователя</Text>;
  }

  const { email, role, isActivated } = currentUser.data;

  if (role === "GUEST") {
    return (
      <>
        <Text as="div">У вас гостевой аккаунт, хотите зарегистрироваться?</Text>
        <Indent size={3} />
        <Text to="/login" as={NavLink}>
          <Button btnColor="illicitPink">
            Перейти на страницу регистрации
          </Button>{" "}
        </Text>
      </>
    );
  }

  return (
    <>
      <Text as="div">Поздравляем вы авторизованы</Text>
      <Text as="div">Ваш email: {email}</Text>
      {role === "ADMIN" && <Text as="div">Ваша роль: {role}</Text>}
      <Text as="div">Аккаунт активирован?: {isActivated ? "Да" : "Нет"}</Text>
      <Indent size={3} />
      <Button btnColor="illicitPink" onClick={handleLogout}>
        Выйти
      </Button>
    </>
  );
};
