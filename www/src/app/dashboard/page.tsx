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

import { ApplicationTable } from "./_componenets/Table";
import styles from "./page.module.css";
import { Navbar } from "./_componenets/Navbar";
import { StatsRingCard } from "./_componenets/StatsRingCard";

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
            <Grid.Col span={6}>
              <StatsRingCard 
              title='Credit Information' 
              pointsUsed={100} 
              pointsUsedSubtitle={'Total Credits Used'} 
              remainingPoints={200} 
              remainingPointsSubtitle={'Remaining Credits'}/>
            </Grid.Col>
            <Grid.Col span={6}>
              <StatsRingCard title='About Applications' 
              pointsUsed={10} 
              pointsUsedSubtitle={'Total Job Applications Sent'} 
              remainingPoints={20} 
              remainingPointsSubtitle={'Remaining With Credit Balance'}/>
            </Grid.Col>
          </Grid>
        </Box>

        <ApplicationTable />
      </div>
    </Box>
  );
}
