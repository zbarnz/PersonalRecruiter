import {
  Title,
  Box,
  Group,
  Card,
  Text,
  TextInput,
  Button,
  Grid,
  Container,
  Select,
} from "@mantine/core";
import { useState } from "react";

export function Billing() {
  const [hasCardOnFile, setHasCardOnFile] = useState(true); // Simulates an existing card on file
  const [showNewCardForm, setShowNewCardForm] = useState(false);

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolderName, setCardHolderName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [country, setCountry] = useState("");

  const handleSave = () => {
    // Add logic to save billing details
    alert("Billing details saved successfully");
  };

  const handleNewCardClick = () => {
    setShowNewCardForm(true);
  };

  return (
    <>
      <Box
        component="header"
        style={{ marginTop: "50px", marginBottom: "20px" }}
      >
        <Title order={3}>Billing Information</Title>
      </Box>
      <Box style={{ marginTop: "50px", padding: "0 20px" }}>
        <Grid gutter="lg">
          {/* Current Plan Information */}
          <Grid.Col span={6}>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Title order={4} mb="md">
                Current Plan
              </Title>
              <Text>Plan: Premium</Text>
              <Text>Next Billing Date: 12/31/2024</Text>
              <Text>Card on File: **** **** **** 1234</Text>
            </Card>
          </Grid.Col>

          {/* New Card Form or Add Card Button */}
          <Grid.Col span={6}>
            {hasCardOnFile && !showNewCardForm ? (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                  Payment Method
                </Title>
                <Text>Card on File: **** **** **** 1234</Text>
                <Group mt="md">
                  <Button onClick={handleNewCardClick}>Add New Card</Button>
                </Group>
              </Card>
            ) : (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={4} mb="md">
                  Update Your Billing Information
                </Title>
                <form>
                  <Grid gutter="md">
                    <Grid.Col span={12}>
                      <TextInput
                        label="Card Number"
                        placeholder="Enter your card number"
                        value={cardNumber}
                        onChange={(event) =>
                          setCardNumber(event.currentTarget.value)
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <TextInput
                        label="Cardholder Name"
                        placeholder="Enter the name on the card"
                        value={cardHolderName}
                        onChange={(event) =>
                          setCardHolderName(event.currentTarget.value)
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Expiration Date"
                        placeholder="MM/YY"
                        value={expirationDate}
                        onChange={(event) =>
                          setExpirationDate(event.currentTarget.value)
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="CVV"
                        placeholder="Enter CVV"
                        type="password"
                        value={cvv}
                        onChange={(event) => setCvv(event.currentTarget.value)}
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <TextInput
                        label="Billing Address"
                        placeholder="Enter your billing address"
                        value={billingAddress}
                        onChange={(event) =>
                          setBillingAddress(event.currentTarget.value)
                        }
                      />
                    </Grid.Col>
                    <Grid.Col span={12}>
                      <Select
                        label="Country"
                        placeholder="Select your country"
                        data={[
                          "United States",
                          "Canada",
                          "United Kingdom",
                          "Australia",
                          "Other",
                        ]}
                        value={country}
                        onChange={(v) => setCountry(v || "")}
                      />
                    </Grid.Col>
                  </Grid>
                  <Group mt="md">
                    <Button onClick={handleSave}>Save Billing Info</Button>
                  </Group>
                </form>
              </Card>
            )}
          </Grid.Col>
        </Grid>
      </Box>
    </>
  );
}
