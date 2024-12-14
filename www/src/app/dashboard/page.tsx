"use client";
import {
  Container,
  Title,
  Text,
  Box,
  Grid,
  Paper,
  Anchor,
} from "@mantine/core";

import {TableSort} from "./_componenets/TableSort"
import styles from "../../styles/page.module.css";
import StatsDisplayCard from "./_componenets/StatsDisplayCard";

export default function Dashboard() {
  return (
    <main className={styles.main}>
      <Box component="header" style={{marginTop: '10px'}}>
        <Title order={3}>Dashboard</Title>
      </Box>
  
      <Box style={{marginTop: '50px', marginBottom: '50px',}}>
        <Grid >
          <Grid.Col span={3}>
            <StatsDisplayCard statText="Applications Sent" statNumber={100} bottomText="Send More Applications"/>
          </Grid.Col>
          <Grid.Col span={3}>
          <StatsDisplayCard statText="Application Points Available" statNumber={100} bottomText="Buy More Points" />

          </Grid.Col>
          <Grid.Col span={3}>
          <StatsDisplayCard statText="Recruiter Messages Sent" statNumber={22} bottomText="Send more messages" />

          </Grid.Col>
          <Grid.Col span={3}>
            <Paper className={styles.statsDisplayCard} shadow="xl" radius="lg" withBorder p="xl">
              <Anchor variant="gradient"
              gradient={{ from: 'blue', to: 'skyblue' }}
              fw={500}
              fz="lg"
              href="#text-props">
                Spin Wheel!
              </Anchor>
            </Paper>
          </Grid.Col>
        </Grid>
      </Box>

      <TableSort />

      <Box component="footer" className={styles.footer}>
        <Text>
          © {new Date().getFullYear()} Personal Recruiter. All rights reserved.
        </Text>
      </Box>
    </main>
  );
}
