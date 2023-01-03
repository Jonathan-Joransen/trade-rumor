import Link from "next/link";
import styles from "../styles/Header.module.css";

export const Header = ({
  buttonProps,
}: {
  buttonProps: { text: string; icon: string; onClick: () => void };
}) => {

  return (
    <div className={styles.container}>
      <Link href="/">
        <div className={styles.header}>
          <img
            className={styles.headerIcon}
            src="../images/basketball.png"
          ></img>
          <div className={styles.headerText}>Trade Rumor</div>
        </div>
      </Link>
      <div className={styles.headerButton} onClick={buttonProps.onClick}>
        <div className={styles.headerButtonText}>{buttonProps.text}</div>
        <img className={styles.headerButtonIcon} src={buttonProps.icon}></img>
      </div>
    </div>
  );
};
