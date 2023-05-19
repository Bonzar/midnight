import type { ChangeEvent } from "react";
import React, { useState } from "react";
import styles from "./login.module.css";
import {
  useLoginMutation,
  useRegistrationMutation,
} from "../../store/slices/authApiSlice";
import { Indent } from "../../components/ui/Indent";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { useNavigate } from "react-router-dom";
import { preventDefault } from "../../utils/react/preventDefault";
import { useReLogin } from "../../hooks/useReLogin";
import { Card } from "../../components/ui/Card";

export const Login = () => {
  const { isSuccess, isLoading } = useReLogin();

  const navigate = useNavigate();

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [registration, { isLoading: isRegistrationLoading }] =
    useRegistrationMutation();

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

      navigate("/");
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
    <Card
      className={styles.authBlock}
      cardColor={isLoginPage ? "venusSlipperOrchid" : "tunicGreen"}
    >
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
          inputColor={isLoginPage ? "tunicGreen" : "venusSlipperOrchid"}
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
          inputColor={isLoginPage ? "tunicGreen" : "venusSlipperOrchid"}
          className={styles.loginInput}
        />
        <Indent size={4} />
        <div className={styles.buttons}>
          {isLoginPage ? (
            <Text className={styles.haveAccountText}>
              Нет аккаунта,{" "}
              <Text
                className={styles.haveAccountTextChangeBtn}
                textColor="tunicGreen"
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
                textColor="venusSlipperOrchid"
                onClick={() => setIsLoginPage(!isLoginPage)}
              >
                войдите
              </Text>
            </Text>
          )}
          {isLoginPage ? (
            <Button
              type="submit"
              btnColor="tunicGreen"
              disabled={isLoginLoading}
            >
              Войти
            </Button>
          ) : (
            <Button
              type="submit"
              btnColor="venusSlipperOrchid"
              disabled={isRegistrationLoading}
            >
              Зарегистрироваться
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};
