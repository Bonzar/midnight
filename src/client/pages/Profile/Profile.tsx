import React from "react";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/slices/userSlice";
import { Text } from "../../components/ui/Text";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Indent } from "../../components/ui/Indent";
import { useLogoutMutation } from "../../store/slices/authApiSlice";
import { useReLogin } from "../../hooks/useReLogin";

export const Profile = () => {
  const { isLoading } = useReLogin();
  const currentUser = useAppSelector(selectUser);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Text as="div" textSize={0}>
        Загрузка...
      </Text>
    );
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
      /* show error from data */
    }
  };

  return (
    <>
      <Text as="div">Поздравляем вы авторизованы</Text>
      <Text as="div">Ваш email: {currentUser.data?.email}</Text>
      <Text as="div">
        Аккаунт активирован?: {currentUser.data?.isActivated ? "Да" : "Нет"}
      </Text>
      <Indent size={3} />
      <Button color="illicitPink" onClick={handleLogout}>
        Выйти
      </Button>
    </>
  );
};