import {
  Title,
  Box,
  Group,
  Card,
  Text,
  TextInput,
  Textarea,
  Button,
  Switch,
  Slider,
  Select,
  Grid,
  Container,
  TagsInput,
} from "@mantine/core";
import { useState } from "react";

export function Preferences() {
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false);
  const [location, setLocation] = useState("");
  const [promptInjectionEnabled, setPromptInjectionEnabled] = useState(false);
  const [maxApplications, setMaxApplications] = useState(10);
  const [jobType, setJobType] = useState("full-time");
  const [notificationEmail, setNotificationEmail] = useState("");

  const handleJobTypeChange = (value: string | null) => {
    if (value !== null) {
      setJobType(value); // Only update state if value is not null
    }
  };

  return (
    <>
      <Box component="header" style={{ marginTop: "50px" }}>
        <Title order={3}>Preferences</Title>
      </Box>
      <Container mt="md" style={{ marginBottom: "50px" }}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Title order={4} mb="md">
            Bot Settings
          </Title>
          <form>
            <Grid gutter="md">
              <Grid.Col span={12}>
                <Switch
                  label="Generate Custom Resume"
                  checked={autoApplyEnabled}
                  onChange={(event) =>
                    setAutoApplyEnabled(event.currentTarget.checked)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Switch
                  label="Enable Prompt Injection"
                  checked={promptInjectionEnabled}
                  onChange={(event) =>
                    setPromptInjectionEnabled(event.currentTarget.checked)
                  }
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Text size="sm" mb="xs">
                  Maximum Applications per Run
                </Text>
                <Slider
                  value={maxApplications}
                  onChange={setMaxApplications}
                  min={1}
                  max={100}
                  marks={[
                    { value: 10, label: "10" },
                    { value: 50, label: "50" },
                    { value: 100, label: "100" },
                  ]}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Select
                  label="Preferred Job Type"
                  placeholder="Select job type"
                  data={[
                    { value: "full-time", label: "Full-Time" },
                    { value: "part-time", label: "Part-Time" },
                    { value: "contract", label: "Contract" },
                    { value: "freelance", label: "Freelance" },
                  ]}
                  value={jobType}
                  onChange={(value) => handleJobTypeChange(value)}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Search Term"
                  placeholder='Ex: "Software Engineer", "Accountant", etc.'
                  value={notificationEmail}
                  onChange={(event) =>
                    setNotificationEmail(event.currentTarget.value)
                  }
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  label="Work Location"
                  placeholder="Enter a location"
                  value={location}
                  onChange={(event) => setLocation(event.currentTarget.value)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <TagsInput
                  label="Custom Keywords"
                  placeholder="Enter keywords to prioritize"
                />
              </Grid.Col>
            </Grid>
            <Group mt="md">
              <Button type="submit">Save Settings</Button>
            </Group>
          </form>
        </Card>
      </Container>
    </>
  );
}
