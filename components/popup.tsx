import React, { useState } from "react";
import { PopUpOptions } from "../model/PopUpOptions";
import styles from "../styles/PopUp.module.css";

const PopUp = ({
  props,
  children,
}: {
  props: PopUpOptions;
  children: Array<React.ReactNode> | React.ReactNode | null;
}): [() => Promise<string>, () => JSX.Element] => {
  const [open, setOpen] = useState(false);
  const [resolver, setResolver] = useState({} as { resolve: (input: string) => void });

  const createPromise = (): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      setResolver({ resolve });
    });
  };

  const getUserInput = async () => {
    setOpen(true);
    console.log("getting user input")
    return await createPromise();
  };

  const onClick = async (status: string) => {
    setOpen(false);
    resolver.resolve(status);
  };

  const popUpUi = (): JSX.Element => (
    <>
      {open && (
        <div className={styles.container}>
          <div className={styles.popUp}>
            <div className={styles.popUpContent}>
              <h1 className={styles.popUpTitle}>{props.title}</h1>
              <h2 className={styles.popUpSubTitle}>{props.subTitle}</h2>
              <div className={styles.popUpOptions}>
                {props.options.map((option, idx) => (
                  <button
                    className={styles.popUpOption}
                    key={idx}
                    onClick={() => onClick(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );

  return [getUserInput, popUpUi];
};

export default PopUp;
