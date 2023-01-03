import { useState } from "react";
import TradeOrDisabledPlayerException, { TradeOrDisabledPlayerExceptionTypes } from "../model/TradeException";
import styles from "../styles/Dashboard.module.css";

export const DashboardExceptions = ({
  allTradeExceptions,
  deleteException,
}: {
    allTradeExceptions: Array<TradeOrDisabledPlayerException>;
  deleteException: (ex: TradeOrDisabledPlayerException) => void;
}) => {

    const [disabledPlayerExceptions, setDisabledPlayerExceptions] = useState(allTradeExceptions.filter(ex => ex.exceptionType === TradeOrDisabledPlayerExceptionTypes.DisabledPlayerException));
    const [tradeExceptions, setTradeExceptions] = useState(allTradeExceptions.filter(ex => ex.exceptionType === TradeOrDisabledPlayerExceptionTypes.TradeException));

    let asCurrency = (num: number): string => {
      return "$" + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    };

  return (
    <div className={styles.exContainer}>
    <div className={styles.header}>Disabled Player Exceptions</div>
      {disabledPlayerExceptions && disabledPlayerExceptions.length > 0 ? (
        disabledPlayerExceptions
          .map((ex) => (
            <div className={styles.teamInfo}>
              <div >
                Exception Ammount: {asCurrency(Number(ex.ammount))}
              </div>
              <button className={styles.deleteExButton} onClick={() => deleteException(ex)}>
                Delete Exception
              </button>
            </div>
          ))
      ) : (
        <div className={styles.teamInfo}>None</div>
      )}
    <div className={styles.header}>Trade Exceptions</div>
    {tradeExceptions && tradeExceptions.length > 0 ? (
        tradeExceptions
          .map((ex) => (
            <div className={styles.teamInfo}>
              <div >
                Exception Ammount: {asCurrency(Number(ex.ammount))}
              </div>
              <button className={styles.deleteExButton} onClick={() => deleteException(ex)}>
                Delete Exception
              </button>
            </div>
          ))
      ) : (
        <div className={styles.teamInfo}>None</div>
      )}
    </div>
  );
};
