import { Image } from "@mantine/core";
import styles from "../styles/page.module.css";
import { Features } from "./components/landing_page/Features";
import { HeroHeader } from "./components/landing_page/HeroHeader";
import { Showcase } from "./components/landing_page/Showcase";
import { NewsLetterBanner } from "./components/landing_page/NewsLetterBanner";

export default function Home() {
  //console.log(styles.main);
  return (
    <div className={styles.main}>
      <section>
        <HeroHeader />
      </section>
      <section>
        <Showcase />
      </section>
      <section>
        <Features />
      </section>
      <section className={styles.newsLetterSection}>
        <NewsLetterBanner />
      </section>
    </div>
  );
}
