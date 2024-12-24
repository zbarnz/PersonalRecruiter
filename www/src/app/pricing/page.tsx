import styles from "./page.module.css"


import { PaymentChoices } from "./_components/PaymentChoices";


export default function Pricing() {


  return (
    <div className={styles.pageWrapper}>
      <h1 className={styles.title}>Pricing Plans</h1>
      <p className={styles.description}>We offer flexible pricing plans to suit different applicants. Whether you're just getting started or looking to send out a massive amount of applications, we have a plan that fits your needs.</p>
      <div className={styles.main}><PaymentChoices /></div>
    </div>
  );
}
