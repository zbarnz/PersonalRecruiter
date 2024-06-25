import { LoginForm } from "./_componenets/LoginForm";
import styles from "./_componenets/LoginForm.module.css";

export default function Home() {
  //console.log(styles.main);
  return (
    <div className={styles.main}>
      <section>
        <LoginForm />
      </section>
    </div>
  );
}
