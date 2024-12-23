import {
  Title,
  Box,
  Group,
  Card,
  Text,
  TextInput,
  Button,
  Grid,
  Container,
  MenuLabel,
} from "@mantine/core";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Link from "next/link";

export function Account() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userInfo = useSelector((state: RootState) => state.user);
  console.log(userInfo);
  const handleSave = () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    // Add logic to save account details
    alert("Account details saved successfully");
  };

  return (
    <>
      <Box component="header" style={{ marginTop: "50px" }}>
        <Title order={3}>Account Settings</Title>
      </Box>
      <Container mt="md" style={{ marginBottom: "50px" }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4} mb="md">
            Update Your Account Information
          </Title>

          <Grid gutter="md">
            {userInfo.user?.email && (
              <Grid.Col span={12}>
                <Text fw={500}>Email</Text>
                <Text>{userInfo.user.email}</Text>
              </Grid.Col>
            )}

            {userInfo.user?.phone && (
              <Grid.Col span={12}>
                <Text fw={500}>Phone</Text>
                <Text>{userInfo.user.phone}</Text>
              </Grid.Col>
            )}

            {userInfo.user?.createdAt && (
              <Grid.Col span={12}>
                <Text fw={500}>Join Date</Text>
                <Text>{userInfo.user.createdAt.toDateString()}</Text>
              </Grid.Col>
            )}
            <Grid.Col span={12}>
              <Text>
                <Link href="/changePass">Change Password</Link>
              </Text>
            </Grid.Col>
          </Grid>
        </Card>
      </Container>
    </>
  );
}
