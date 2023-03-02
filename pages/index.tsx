import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2792567691913768"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <div data-ezoicname="top_of_page_home" id="ezoic-pub-ad-placeholder-175"></div>
      <main className={styles.main}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Trade Rumor</h1>
          <p className={styles.subtitle}>The trade machine that's accurate</p>
        </div>
        <div className={styles.contentContainer}>
          <ul className={styles.featuresList}>
            <li className={styles.featuresItem}>Step 1. Pick Teams</li>
            <li className={styles.featuresItem}>Step 2. Pick Players</li>
            <li className={styles.featuresItem}>
              Step 3. See If Your Trade Works
            </li>
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
        <Link className={styles.viewSavedLink} href={"./contact"}>
          contact
        </Link>
        <Link className={styles.viewSavedLink} href={"./about"}>
          about
        </Link>
        <Link className={styles.viewSavedLink} href={"./privacypolicy"}>
          privacy
        </Link>
      </footer>
    </div>
  );
};

Home.auth = false;

export default Home;
