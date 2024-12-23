import {
  Card,
  Group,
  RingProgress,
  Text,
  useMantineTheme,
} from "@mantine/core";
import classes from "./StatsRingCard.module.css";

export function StatsRingCard({
  title,
  pointsUsed,
  pointsUsedSubtitle,
  remainingPoints,
  remainingPointsSubtitle,
}) {
  const stats = [{ value: remainingPoints, label: remainingPointsSubtitle }];
  const theme = useMantineTheme();
  const total = 2334;
  const completed = 200;
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const d = new Date();
  let month = months[d.getMonth()];
  const items = stats.map((stat) => (
    <div key={stat.label}>
      <Text className={classes.label}>{stat.value}</Text>
      <Text size="xs" c="dimmed">
        {stat.label}
      </Text>
    </div>
  ));

  return (
    <Card withBorder p="xl" radius="md" className={classes.card}>
      <div className={classes.inner}>
        <div>
          <Text fz="xl" className={classes.label}>
            {title}
          </Text>
          <div>
            <Text className={classes.lead} mt={30}>
              {pointsUsed}
            </Text>
            <Text fz="xs" c="dimmed">
              {pointsUsedSubtitle} in {month}
            </Text>
          </div>
          <Group mt="lg">{items}</Group>
        </div>

        <div className={classes.ring}>
          <RingProgress
            roundCaps
            thickness={6}
            size={150}
            sections={[
              { value: (completed / total) * 100, color: theme.primaryColor },
            ]}
            label={
              <div>
                <Text ta="center" fz="lg" className={classes.label}>
                  {(
                    (pointsUsed / (remainingPoints + pointsUsed)) *
                    100
                  ).toFixed(0)}
                  %
                </Text>
                <Text ta="center" fz="xs" c="dimmed">
                  Balance Used
                </Text>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
}
