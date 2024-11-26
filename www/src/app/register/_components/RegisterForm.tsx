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
  Button,
  Divider,
} from "@mantine/core";
import styles from "./RegisterForm.module.css";
import { useEffect, useState } from "react";
import { GoogleButton } from "./GoogleButton";
import { TwitterButton } from "./TwitterButton";
import { notifications } from "@mantine/notifications";
import userService from "../../../services/userService";

const initialState = {
  email: "",
  phone: "",
  password: "",
  passwordConfirmation: "",
};

export function RegisterForm() {
  const [fields, setFields] = useState(initialState);
  const [registering, setregistering] = useState(false);

  useEffect(() => {
    const register = async () => {
      try {
        userService.register({
          email: fields.email,
          phone: fields.phone,
          password: fields.password,
        });
      } catch (err) {
        if (!(err instanceof Error)) {
          return;
        }
        notifications.show({
          message: "Registration Failed: " + err.message,
          color: "red",
        });
      }
      setregistering(false);
      setFields(initialState);
    };

    if (registering) {
      register();
    }
  }, [registering]);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setregistering(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  return (
    <Container size={420} my={40} className={styles.wrapper}>
      <Title ta="center" className={styles.title}>
        Let's Get Started!
      </Title>

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
        <PasswordInput
          label="Confirm Password"
          name="passwordConfirmation"
          placeholder="Your password"
          value={fields.passwordConfirmation}
          onChange={(e) => handleChange(e)}
          required
          mt="md"
        />

        <TextInput
          label="Phone"
          name="phone"
          description="Get 1000 free credits (~100 applications)"
          placeholder="555-555-5555"
          value={fields.phone}
          onChange={(e) => handleChange(e)}
          mt="md"
        />
        <Button fullWidth mt="xl" onClick={handleSubmit} loading={registering}>
          Sign up 
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
