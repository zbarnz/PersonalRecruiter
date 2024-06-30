import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "../styles/app.module.css";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Snap Candidate",
  description: "Quick apply now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Notifications />
          <Header />
          <main className={styles.main}>{children}</main>
          <Footer />
        </MantineProvider>
      </body>
    </html>
  );
}
