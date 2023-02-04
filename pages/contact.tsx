import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Header } from "../components/header";
import styles from "../styles/Contact.module.css";

export const ContactPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    if (!router.asPath.includes('#loaded')) {
      router.push(window.location + '#loaded')
      router.reload()
    }
  }, [])
  const [showCompleted, setShowCompleted] = useState(false);
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [completedMessage, setCompletedMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject,
        email,
        message,
      }),
    });
    if (response.ok) {
      setCompletedMessage(
        "Success! We will get back to you as soon as possible."
      );
    } else {
      setCompletedMessage("Error sending email, Please try again later.");
    }
    setShowCompleted(true);
  };

  return (
    <div className={styles.container}>
      <Header buttonProps={null}></Header>
      <div data-ezoicname="top_of_page_contact" id="ezoic-pub-ad-placeholder-173"> </div>
      <div className={styles.content}>
        <div className={styles.wrapper}>
          <div className={styles.header}>Contact Us</div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.input}>
              <label htmlFor="email">Reply Email</label>
              <input
                type="text"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            <div className={styles.buttonContainer}>
              <button disabled={showCompleted} type="submit">
                Send
              </button>
            </div>
          </form>
          {showCompleted && (
            <div className={styles.completed}>{completedMessage}</div>
          )}
        </div>
      </div>
      <div data-ezoicname="bottom_of_page_contact" id="ezoic-pub-ad-placeholder-174"> </div>
    </div>
  );
};

export default ContactPage;
