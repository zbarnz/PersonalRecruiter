import {
  Container,
  Title,
  Text,
  Box,
  Grid,
  Paper,
  Anchor,
  Center,
} from "@mantine/core";
import styles from "../page.module.css";

export function Resume() {
  return (
    <>
      <Box component="header" style={{ marginTop: "50px" }}>
        <Title order={3}>Resume</Title>
      </Box>
      <Box style={{ marginTop: "50px", marginBottom: "50px" }}>
        Resume will go here homie
      </Box>
    </>
  );
}
