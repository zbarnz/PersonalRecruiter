import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "../styles/app.module.css";

import { Header } from "./componenets/Header";

import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
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
          <Header />
          <main className={styles.main}>{children}</main>
        </MantineProvider>
      </body>
    </html>
  );
}
