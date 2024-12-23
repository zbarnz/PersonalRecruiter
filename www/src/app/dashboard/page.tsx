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

import { useState } from "react";

import { ApplicationTable } from "./_componenets/Table";
import styles from "./page.module.css";
import { Navbar } from "./_componenets/Navbar";
import { MainDash } from "./_componenets/Dashboard";
import { Resume } from "./_componenets/Resume";
import { Preferences } from "./_componenets/Preferences";
import { Account } from "./_componenets/Account";
import { Billing } from "./_componenets/Billing";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard"); // State for active page

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <MainDash />;
      case "resume":
        return <Resume />;
      case "preferences":
        return <Preferences />;
      case "billing":
        return <Billing />;
      case "account":
        return <Account />;
      default:
        return <MainDash />;
    }
  };

  return (
    <Box className={styles.pageWrapper}>
      <Navbar setActivePage={setActivePage} />
      <div className={styles.main}>{renderPage()}</div>
    </Box>
  );
}
