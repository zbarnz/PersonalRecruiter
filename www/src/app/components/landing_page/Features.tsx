"use client";

import {
  Title,
  SimpleGrid,
  Text,
  Button,
  ThemeIcon,
  Grid,
  rem,
  GridCol,
  useMantineTheme,
  Container,
} from "@mantine/core";
import {
  IconFlame,
  IconBulb,
  IconUserHeart,
  IconTimeDurationOff,
} from "@tabler/icons-react";
import classes from "../../../styles/components/Features.module.css";

const features = [
  {
    icon: IconTimeDurationOff,
    title: "Efficient and time-saving",
    description:
      "The AI handles the entire job application process, saving you countless hours and effort.",
  },
  {
    icon: IconBulb,
    title: "Smart and adaptive",
    description:
      "Utilizes advanced algorithms to tailor applications specifically for each job, maximizing relevance and appeal.",
  },
  {
    icon: IconUserHeart,
    title: "User-friendly",
    description:
      "Easily manage and track your job applications through an intuitive dashboard.",
  },
  {
    icon: IconFlame,
    title: "Flexible",
    description:
      "Customizable settings to match your unique job search preferences and career goals.",
  },
];

export function Features() {
  const theme = useMantineTheme();

  const items = features.map((feature) => (
    <div key={feature.title}>
      <ThemeIcon
        size={44}
        radius="md"
        variant="gradient"
        gradient={{ deg: 133, from: "blue", to: "cyan" }}
      >
        <feature.icon
          style={{ width: rem(26), height: rem(26) }}
          stroke={1.5}
        />
      </ThemeIcon>
      <Text fz="lg" mt="sm" fw={500}>
        {feature.title}
      </Text>
      <Text c="dimmed" fz="sm">
        {feature.description}
      </Text>
    </div>
  ));

  return (
    <div className={classes.wrapper}>
      <Grid gutter={80} maw={1600}>
        <GridCol span={{ base: 12, md: 5 }}>
          <Title className={classes.title} order={2}>
            A fully automated job application AI for your job search
          </Title>
          <Text c="dimmed">
            Find and secure your next job effortlessly - Our AI-driven software
            applies to jobs on your behalf, optimizing each application to match
            job descriptions and increasing your chances of landing interviews.
          </Text>

          <Button
            variant="gradient"
            gradient={{ deg: 133, from: "blue", to: "cyan" }}
            size="lg"
            radius="md"
            mt="xl"
          >
            Get started
          </Button>
        </GridCol>
        <GridCol span={{ base: 12, md: 7 }}>
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing={30}>
            {items}
          </SimpleGrid>
        </GridCol>
      </Grid>
    </div>
  );
}
