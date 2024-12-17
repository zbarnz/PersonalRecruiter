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

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard"); // State for active page

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <MainDash />;
      case "resume":
        return <Resume />;
      case "prefereneces":
      //return <Preferences />;
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
