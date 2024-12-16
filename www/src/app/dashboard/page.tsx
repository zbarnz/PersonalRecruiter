"use client";
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

import { TableSort } from "./_componenets/Table";
import styles from "./page.module.css";
import { Navbar } from "./_componenets/Navbar";

export default function Dashboard() {
  return (
    <Box className={styles.pageWrapper}>
      <Navbar />

      <div className={styles.main}>
        <Box component="header" style={{ marginTop: "50px" }}>
          <Title order={3}>Dashboard</Title>
        </Box>

        <Box style={{ marginTop: "50px", marginBottom: "50px" }}>
          <Grid>
            <Grid.Col span={3}>
              <Paper
                className={styles.statsDisplayCard}
                shadow="xl"
                radius="lg"
                withBorder
                p="xl"
              >
                <div className={styles.top}>
                  <span>Applications Sent:</span>
                  <span>109</span>
                </div>

                <div className={styles.bottom}>
                  <span>Send More applications</span>
                </div>
              </Paper>
            </Grid.Col>
            <Grid.Col span={3}>
              <Paper
                className={styles.statsDisplayCard}
                shadow="xl"
                radius="lg"
                withBorder
                p="xl"
              >
                <div className={styles.top}>
                  <span>Application Points Available:</span>
                  <span>109</span>
                </div>

                <div className={styles.bottom}>
                  <span>Buy More Points</span>
                </div>
              </Paper>
            </Grid.Col>
            <Grid.Col span={3}>
              <Paper
                className={styles.statsDisplayCard}
                shadow="xl"
                radius="lg"
                withBorder
                p="xl"
              >
                <div className={styles.top}>
                  <span>Recruiter Messages Sent:</span>
                  <span>109</span>
                </div>

                <div className={styles.bottom}>
                  <span>Send Messages</span>
                </div>
              </Paper>
            </Grid.Col>
            <Grid.Col span={3}>
              <Paper
                className={styles.statsDisplayCard}
                shadow="xl"
                radius="lg"
                withBorder
                p="xl"
              >
                <Anchor
                  variant="gradient"
                  gradient={{ from: "blue", to: "skyblue" }}
                  fw={500}
                  fz="lg"
                  href="#text-props"
                >
                  Spin Wheel!
                </Anchor>
              </Paper>
            </Grid.Col>
          </Grid>
        </Box>

        <TableSort />
      </div>
    </Box>
  );
}
