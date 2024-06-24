"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "../../styles/app.module.css";

import "@mantine/core/styles.css";
import { DoubleNavbar } from "./_componenets/DoubleNavbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.pageWrapper}>
      <DoubleNavbar />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
