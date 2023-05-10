import type { ChangeEvent, FormEvent } from "react";
import React, { useState } from "react";
import styles from "./login.module.css";
import { useLoginMutation } from "../../store/slices/authApiSlice";
import { Indent } from "../../components/ui/Indent";
import { Text } from "../../components/ui/Text";
import { isApiError } from "../../utils/isApiError";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { useAppSelector } from "../../store/hooks";
import { selectUser } from "../../store/slices/userSlice";

export const Login = () => {
  const [login, loginData] = useLoginMutation();

  const currentUser = useAppSelector(selectUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData) as {
      password: string;
      email: string;
    };

    login(data);
  };

  return (
    <div className={styles.authBlock}>
      <Text as="h1">Авторизация: {currentUser.isAuth ? "Да" : "Нет"}</Text>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="login-email" className={styles.loginLabel}>
          Логин:
        </Label>
        <Input
          value={email}
          inputColor="embarrassed"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEmail(e.currentTarget.value)
          }
          id="login-email"
          name="email"
          type="email"
          placeholder="Введите email"
          autoComplete="email"
          className={styles.loginInput}
        />
        <Indent size={3} />
        <Label htmlFor="login-password" className={styles.loginLabel}>
          Пароль:
        </Label>
        <Input
          inputColor="embarrassed"
          id="login-password"
          name="password"
          type="password"
          placeholder="Введите password"
          autoComplete="password"
          className={styles.loginInput}
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPassword(e.currentTarget.value)
          }
        />
        <Indent size={4} />
        <div className={styles.buttons}>
          <Button color="illicitPink" disabled={loginData.isLoading}>
            Login
          </Button>
        </div>
      </form>
      {loginData.isError && (
        <>
          <Indent size={3} />
          <Text>
            {loginData.isError &&
              isApiError(loginData.error) &&
              loginData.error.data.message}
          </Text>
        </>
      )}
    </div>
  );
};
