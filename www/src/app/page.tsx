import {
  Container,
  Title,
  Text,
  Button,
  Card,
  SimpleGrid,
  Box,
} from "@mantine/core";
import styles from "../styles/page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <Box component="header" className={styles.navbar}>
        <Title order={3}>Personal Recruiter</Title>
        <Button variant="outline">Contact Us</Button>
      </Box>

      <Container size="md" className={styles.hero}>
        <Title order={1}>Making Your Digital Experience Better</Title>
        <Text size="lg" style={{ marginTop: 20 }}>
          Explore our tools and services to enhance your business.
        </Text>
        <Button variant="filled" size="md" style={{ marginTop: 20 }}>
          Learn More
        </Button>
      </Container>

      <Container size="lg" className={styles.features}>
        <SimpleGrid cols={3} spacing="lg">
          {["Feature 1", "Feature 2", "Feature 3"].map((feature) => (
            <Card key={feature} className={styles.featureCard}>
              <Title order={4}>{feature}</Title>
              <Text>
                Details about {feature.toLowerCase()}, and how it helps the
                user.
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      <Box component="footer" className={styles.footer}>
        <Text>
          © {new Date().getFullYear()} Personal Recruiter. All rights reserved.
        </Text>
      </Box>
    </main>
  );
}
