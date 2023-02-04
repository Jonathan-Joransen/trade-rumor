import Link from "next/link";
import { Header } from "../components/header";
import styles from "../styles/Home.module.css";
import Router, { useRouter } from "next/router";
import { useEffect } from "react";

const About = () => {
  return (
    <div className={styles.aboutContainer}>
      <Header buttonProps={null}></Header>
      <div data-ezoicname="top_of_page_about" id="ezoic-pub-ad-placeholder-172"> </div>
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
      <div data-ezoicname="bottom_of_page_about" id="ezoic-pub-ad-placeholder-171"> </div>
    </div>
  );
};

export default About;
