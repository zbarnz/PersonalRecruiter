import {
  Title,
  Box,
  Group,
  Card,
  Text,
  TextInput,
  Textarea,
  Button,
  Grid,
  Container,
} from "@mantine/core";

import styles from "./Resume.module.css";
import { useState } from "react";
import { Dropzone, DropzoneProps, PDF_MIME_TYPE } from "@mantine/dropzone";
interface UploadedFile {
  file: File;
  preview: string;
}
export function Resume() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const handleDrop = (files: File[]) => {
    const file = files[0]; // Handle single file for simplicity
    console.log(file);
    const preview = URL.createObjectURL(file);
    console.log(preview);
    setUploadedFile({ file, preview });
  };

  return (
    <>
      <Box component="header" style={{ marginTop: "50px" }}>
        <Title order={3}>Resume</Title>
      </Box>
      <Group align="start">
        {/* Resume Info Card */}
        <Container className={styles.uploadContainer}>
          <Dropzone
            onDrop={handleDrop}
            accept={PDF_MIME_TYPE}
            maxSize={5 * 1024 ** 2}
          >
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              style={{ width: 300 }}
              className={styles.upload}
            >
              <Card.Section>
                {uploadedFile ? (
                  uploadedFile.file.type === "application/pdf" ? (
                    <object
                      data={uploadedFile.preview}
                      type="application/pdf"
                      width="100%"
                      height="160"
                    >
                      <Text c="dimmed">PDF Preview Not Supported</Text>
                    </object>
                  ) : (
                    <Box
                      style={{
                        height: 160,
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text c="dimmed">No Preview Available</Text>
                    </Box>
                  )
                ) : (
                  <Box
                    style={{
                      height: 160,
                      backgroundColor: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text c="dimmed">No File Uploaded</Text>
                  </Box>
                )}
              </Card.Section>

              <Text mt="md">
                {uploadedFile
                  ? uploadedFile.file.name
                  : "Upload a file to see details"}
              </Text>
              <Text size="sm" c="dimmed">
                {uploadedFile
                  ? `${(uploadedFile.file.size / 1024).toFixed(2)} KB`
                  : "File size will appear here"}
              </Text>
            </Card>
          </Dropzone>
        </Container>

        <Container>
          <Title order={4} mb="md">
            Resume Information
          </Title>
          <form>
            <Grid gutter="md">
              {/* Personal Info */}
              <Grid.Col span={6}>
                <TextInput label="Name" placeholder="Your name" required />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Email" placeholder="Your email" required />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Phone" placeholder="Your phone number" />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Location" placeholder="Your location" />
              </Grid.Col>
              <Grid.Col span={12}>
                <TextInput label="Link" placeholder="Portfolio/LinkedIn URL" />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Summary"
                  placeholder="Brief professional summary"
                  autosize
                  minRows={3}
                />
              </Grid.Col>

              {/* Education */}
              <Grid.Col span={6}>
                <TextInput label="School" placeholder="Your school name" />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Degree" placeholder="Degree earned" />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="GPA" placeholder="Your GPA" />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Date" placeholder="Graduation date" />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Education Description"
                  placeholder="Details about education"
                  autosize
                  minRows={3}
                />
              </Grid.Col>

              {/* Work Experience */}
              <Grid.Col span={6}>
                <TextInput label="Company" placeholder="Company name" />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Job Title" placeholder="Your job title" />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput label="Date" placeholder="Employment period" />
              </Grid.Col>
              <Grid.Col span={12}>
                <Textarea
                  label="Work Descriptions"
                  placeholder="Job responsibilities and achievements"
                  autosize
                  minRows={3}
                />
              </Grid.Col>

              {/* Skills */}
              <Grid.Col span={12}>
                <Textarea
                  label="Skills"
                  placeholder="List of skills"
                  autosize
                  minRows={3}
                />
              </Grid.Col>
            </Grid>
            <Group mt="md">
              <Button type="submit">Save</Button>
            </Group>
          </form>
        </Container>
      </Group>
    </>
  );
}
