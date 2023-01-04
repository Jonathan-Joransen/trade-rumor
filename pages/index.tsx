import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>NBA Trade Rumor</title>
        <meta
          name="description"
          content="See if NBA trades work using up to date live data."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Trade Rumor</h1>
          <p className={styles.subtitle}>The trade machine that's accurate</p>
        </div>
        <div className={styles.contentContainer}>
          <ul className={styles.featuresList}>
            <li className={styles.featuresItem}>Step 1. Pick Teams</li>
            <li className={styles.featuresItem}>Step 2. Pick Players</li>
            <li className={styles.featuresItem}>Step 3. See If Your Trade Works</li>
          </ul>

          <Link className={styles.startLink} href={"./trade"}>
            Start Trading
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <Link className={styles.viewSavedLink} href={"./trade/saved"}>
          view saved
        </Link>
      </footer>
    </div>
  );
}