"use client";
import {
  Container,
  Title,
  Text,
  Button,
  Card,
  SimpleGrid,
  Box,
} from "@mantine/core";

import {TableReviews} from "./_componenets/TableReviews"
import styles from "../../styles/page.module.css";

export default function Dashboard() {
  return (
    <main className={styles.main}>
      <Box component="header" className={styles.navbar}>
        <Title order={3}>Personal Recruiter</Title>
      </Box>

      <Container size="md" className={styles.hero}>
        <Title order={1}>Forcing Employment Upon You Since 2024</Title>
      </Container>

      <TableReviews />

      <Box component="footer" className={styles.footer}>
        <Text>
          © {new Date().getFullYear()} Personal Recruiter. All rights reserved.
        </Text>
      </Box>
    </main>
  );
}
