import { Title, Text, Button, Container } from "@mantine/core";
import { Dots } from "./Dots";
import classes from "../../../styles/components/HeroHeader.module.css";

export function HeroHeader() {
  return (
    <Container className={classes.wrapper} size="100%">
      <Dots className={classes.dots} style={{ left: 0, top: 0 }} />

      <Dots className={classes.dots} style={{ right: 0, top: 0 }} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Automated AI{" "}
          <Text component="span" className={classes.highlight} inherit>
            job applications
          </Text>{" "}
          for any candidate
        </Title>

        <Container p={0} size={800}>
          <Text size="lg" c="dimmed" className={classes.description}>
            Streamline your job search with AI automation. Our AI applies for
            jobs on your behalf, ensuring every application is perfectly
            tailored and submitted across multiple platforms.
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            className={classes.control}
            size="lg"
            variant="default"
            color="gray"
          >
            Try Free
          </Button>
          <Button className={classes.control} size="lg">
            Purchase Credits
          </Button>
        </div>
      </div>
    </Container>
  );
}
