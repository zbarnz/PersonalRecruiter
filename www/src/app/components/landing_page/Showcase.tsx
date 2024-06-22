import { Image } from "@mantine/core";

import styles from "../../../styles/components/Showcase.module.css";

export function Showcase() {
  return (
    <div className={styles.wrapper}>
      <Image src="./images/dashboardipsum.png" h={540} w="auto" fit="contain" />
    </div>
  );
}
