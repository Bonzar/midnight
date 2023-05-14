import type { ChangeEvent } from "react";
import React, { useEffect, useState } from "react";
import styles from "./login.module.css";
import {
  useLoginMutation,
  useRegistrationMutation,
} from "../../store/slices/authApiSlice";
import { Indent } from "../../components/ui/Indent";
import { Text } from "../../components/ui/Text";
import { isApiError } from "../../utils/isApiError";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { useNavigate } from "react-router-dom";
import { preventDefault } from "../../utils/react/preventDefault";
import { useReLogin } from "../../hooks/useReLogin";

export const Login = () => {
  const { isSuccess, isLoading } = useReLogin();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate("../profile", { replace: true });
    }
  }, [navigate, isSuccess]);

  const [login, loginData] = useLoginMutation();
  const [registration, registrationData] = useRegistrationMutation();

  const [isLoginPage, setIsLoginPage] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (isLoginPage) {
        await login({ email, password }).unwrap();
      } else {
        await registration({
          email,
          password,
          firstName: "Vlad",
          addresses: [],
        }).unwrap();
      }
      navigate("/profile");
    } catch {
      /* show error from data */
    }
  };

  if (isLoading) {
    return (
      <Text as="div" textSize={0}>
        Загрузка...
      </Text>
    );
  }

  return (
    <div className={styles.authBlock}>
      <Text as="h1">{isLoginPage ? "Вход в аккаунт" : "Регистрация"}</Text>
      <form onSubmit={preventDefault(handleSubmit)}>
        <Label htmlFor="login-email" className={styles.loginLabel}>
          Почта:
        </Label>
        <Input
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.currentTarget.value)
          }
          id="login-email"
          name="email"
          type="email"
          placeholder="Введите email"
          autoComplete="email"
          inputColor="embarrassed"
          className={styles.loginInput}
        />
        <Indent size={3} />
        <Label htmlFor="login-password" className={styles.loginLabel}>
          Пароль:
        </Label>
        <Input
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.currentTarget.value)
          }
          id="login-password"
          name="password"
          type="password"
          placeholder="Введите пароль"
          autoComplete="password"
          inputColor="embarrassed"
          className={styles.loginInput}
        />
        <Indent size={4} />
        <div className={styles.buttons}>
          {isLoginPage ? (
            <Text className={styles.haveAccountText}>
              Нет аккаунта,{" "}
              <Text
                className={styles.haveAccountTextChangeBtn}
                textColor="embarrassed"
                onClick={() => setIsLoginPage(!isLoginPage)}
              >
                зарегистрируйтесь
              </Text>
            </Text>
          ) : (
            <Text className={styles.haveAccountText}>
              Есть аккаунт,{" "}
              <Text
                className={styles.haveAccountTextChangeBtn}
                textColor="embarrassed"
                onClick={() => setIsLoginPage(!isLoginPage)}
              >
                войдите
              </Text>
            </Text>
          )}
          {isLoginPage ? (
            <Button
              type="submit"
              color="illicitPink"
              disabled={loginData.isLoading}
            >
              Войти
            </Button>
          ) : (
            <Button
              type="submit"
              color="yellowMellow"
              disabled={registrationData.isLoading}
            >
              Зарегистрироваться
            </Button>
          )}
        </div>
      </form>
      {isLoginPage && loginData.isError && (
        <>
          <Indent size={3} />
          <Text>
            {loginData.isError &&
              isApiError(loginData.error) &&
              loginData.error.data.message}
          </Text>
        </>
      )}
      {!isLoginPage && registrationData.isError && (
        <>
          <Indent size={3} />
          <Text>
            {registrationData.isError &&
              isApiError(registrationData.error) &&
              registrationData.error.data.message}
          </Text>
        </>
      )}
    </div>
  );
};
