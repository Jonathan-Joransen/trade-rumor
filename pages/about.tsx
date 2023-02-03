import Link from "next/link";
import { Header } from "../components/header";
import styles from "../styles/Home.module.css";

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <Header buttonProps={null}></Header>
      {/* <!-- Ezoic - top_of_page - top_of_page --> */}
      <div id="ezoic-pub-ad-placeholder-162"> </div>
      {/* <!-- End Ezoic - top_of_page - top_of_page --> */}
      <div className={styles.aboutContent}>
        <h1 className={styles.aboutTitle}>About Us</h1>
        <div className={styles.aboutTextContainer}>
          <div className={styles.aboutText}>
            At NBATradeRumor.com, we want to create the perfect tool for
            calculating whether or not a trade works under the NBA's Collective
            Bargaining Agreement.
          </div>
          <div className={styles.aboutText}>
            As such, we are always looking to improve. Unlike other trade
            machines, you can reach us on the{" "}
            <Link href="/contact">Contact Us</Link> tab with any errors you see
            or suggestions you have so we don't have inaccuracies or glitches.
          </div>
          <div className={styles.aboutText}>
            We are looking to grow into adding more and better features down the
            line, but for now you can use us as a tool to see if a trade works,
            if a player can be traded, what draft picks each team could trade
            and tons more.
          </div>
          <div className={styles.aboutText}>
            This is simply the best NBA Trade Machine out there because it
            interacts with you as the user. If you're a NBA Trade nerd like
            myself, you will love this tool and it's development as it grows.
            I'm excited to work with and for you!
          </div>
        </div>
      </div>
      {/* <!-- Ezoic - bottom_of_page - bottom_of_page --> */}
      <div id="ezoic-pub-ad-placeholder-164"> </div>
      {/* <!-- End Ezoic - bottom_of_page - bottom_of_page --> */}
    </div>
  );
};

export default About;
