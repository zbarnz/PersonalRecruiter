import { useState } from "react";
import {
  IconGauge,
  IconHome2,
  IconLogout,
  IconSwitchHorizontal,
  IconUser,
  IconFileCv,
  IconSettings,
  IconChartBar,
} from "@tabler/icons-react";
import { Code, Group, Text } from "@mantine/core";
import styles from "./Navbar.module.css";
import { useStore, useSelector } from "react-redux";
import { store, RootState } from "../../../store";
import { usePathname } from "next/navigation";

export function Navbar({
  setActivePage,
}: {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [active, setActive] = useState("Billing");

  const data = [
    {
      label: "Dashboard",
      icon: IconGauge,
      onClick: () => setActivePage("dashboard"),
    },
    {
      label: "Resume",
      icon: IconFileCv,
      onClick: () => setActivePage("resume"),
    },
    {
      label: "Preferences",
      icon: IconSettings,
      onClick: () => setActivePage("preferences"),
    },
    {
      label: "Billing",
      icon: IconChartBar,
      onClick: () => setActivePage("billing"),
    },
    {
      label: "Account",
      icon: IconUser,
      onClick: () => setActivePage("account"),
    },
  ];

  // Use `useSelector` to subscribe to `user` updates
  const userInfo = useSelector((state: RootState) => state.user);

  console.log(userInfo);

  const links = data.map((item) => (
    <a
      className={styles.link}
      data-active={item.label === active || undefined}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        item.onClick();
      }}
    >
      <item.icon className={styles.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarMain}>
        <Text className={styles.header}>
          {!userInfo?.user ? (
            <>
              <IconUser className={styles.linkIcon} stroke={2} size={4} />
              <span>Snap Candidate</span>
            </>
          ) : (
            <>
              <IconUser className={styles.linkIcon} stroke={2} size={4} />
              <span>{userInfo.user.email}</span>
            </>
          )}
        </Text>
        {links}
      </div>

      <div className={styles.footer}>
        <a
          href="#"
          className={styles.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={styles.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
