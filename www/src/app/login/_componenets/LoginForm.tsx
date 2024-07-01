"use client";

import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button, Divider
} from "@mantine/core";
import styles from "./LoginForm.module.css";
import { useEffect, useState } from "react";
import { GoogleButton } from "./GoogleButton";
import { TwitterButton } from "./TwitterButton";
//import UserAPI from "../../../../api/classes/userAPI";
import { notifications } from "@mantine/notifications";
import userAPI from "../../../../lib/api/user";

const initialState = {
  email: "",
  password: "",
};

export function LoginForm() {
  const [fields, setFields] = useState(initialState);
  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const login = async () => {
      try {
        userAPI.login({ email: fields.email, password: fields.password });
      } catch (err) {
        if (!(err instanceof Error)) {
          return;
        }
        notifications.show({
          message: "Login Failed: " + err.message,
          color: "red",
        });
      }
      setLoggingIn(false);
      setFields(initialState);
    };

    if (loggingIn) {
      login();
    }
  }, [loggingIn]);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoggingIn(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  return (
    <Container size={420} my={40} className={styles.wrapper}>
      <Title ta="center" className={styles.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Do not have an account yet?{" "}
        <Anchor size="sm" component="button">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          label="Email"
          name="email"
          placeholder="you@example.com"
          value={fields.email}
          onChange={(e) => handleChange(e)}
          required
        />
        <PasswordInput
          label="Password"
          name="password"
          placeholder="Your password"
          value={fields.password}
          onChange={(e) => handleChange(e)}
          required
          mt="md"
        />
        <Group justify="space-between" mt="lg">
          <Checkbox label="Remember me" />
          <Anchor component="button" size="sm">
            Forgot password?
          </Anchor>
        </Group>
        <Button fullWidth mt="xl" onClick={handleSubmit} loading={loggingIn}>
          Sign in
        </Button>
        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />
        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
          <TwitterButton radius="xl">Twitter</TwitterButton>
        </Group>
      </Paper>
    </Container>
  );
}
