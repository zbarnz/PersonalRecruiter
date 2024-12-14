import { useState } from 'react';
import {
  IconGauge,
  IconHome2,
  IconLogout,
  IconSwitchHorizontal,
  IconUser,
} from '@tabler/icons-react';
import { Code, Group, Text } from '@mantine/core';
import styles from './Navbar.module.css';

const data = [
  { link: '', label: 'Home', icon: IconHome2 },
  { link: '', label: 'Dashboard', icon: IconGauge },
  { link: '', label: 'Account', icon: IconUser },
];

export function Navbar() {
  const [active, setActive] = useState('Billing');

  const links = data.map((item) => (
    <a
      className={styles.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
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
          <IconUser className={styles.linkIcon} stroke={1.5} />
          <span>Personal Recruiter</span>
        </Text>
        {links}
      </div>

      <div className={styles.footer}>
        <a href="#" className={styles.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={styles.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}