"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import styles from "../styles/app.module.css";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Provider, useSelector, useStore } from "react-redux";

import { store, RootState } from "../store";
import { useRouter, usePathname } from "next/navigation";
import userService from "../services/userService";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Snap Candidate",
  description: "Quick apply now!",
};

const pagesNeedingAuth: Set<string> = new Set([]);

function AppContent({ children }: { children: React.ReactNode }) {
  const store = useStore<RootState>();
  const router = useRouter();
  const userInfo = store.getState().user;
  const page = usePathname();
  const blockPage = pagesNeedingAuth.has(page as string);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function refresh() {
      if (!userInfo.user?.id) {
        await userService.refresh();
      }

      const user = store.getState().user;

      if (!user.user && blockPage) {
        router.push("/login");
      }
    }

    if (!userInfo.loggedIn) {
      refresh();
    }
    setLoading(false);
  }, [userInfo, store, router]);

  return (
    <>
    { loading ? <div /> :
      <MantineProvider>
        <Notifications />
        <Header />
        <main className={styles.main}>{children}</main>
        <Footer />
      </MantineProvider>
    }
    </>
  );
}

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
        <Provider store={store}>
          <AppContent>{children}</AppContent>
        </Provider>
      </body>
    </html>
  );
}
