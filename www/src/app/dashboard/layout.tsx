"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "../../styles/app.module.css";

import "@mantine/core/styles.css";
import { Navbar } from "./_componenets/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <div className={styles.main}>{children}</div>
    </div>
  );
}
