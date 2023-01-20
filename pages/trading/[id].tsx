import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Header } from "../../components/header";
import { TeamPreview } from "../../components/teamPreview";
import DatabaseClient from "../../data/Database";
import TradeResult from "../../model/TradeResult";
import styles from "../../styles/TradeResults.module.css";

export const TradeResultsFromId = ({
  tradeResult,
}: {
  tradeResult: TradeResult;
}) => {
  let router = useRouter();
  const saveImg = React.createRef<HTMLImageElement>();

  let handleViewSaved = () => {
    router.push({
      pathname: "../trade/saved",
    });
  };

  let handleRestart = () => {
    router.push({
      pathname: "/trade",
    });
  };

  let handleEdit = () => {
    router.push({
      pathname: "/trading",
      query: {
        teamNames: JSON.stringify(
          tradeResult.trade.teams.map((team) => team.teamName)
        ),
        tradeId: tradeResult.id,
      },
    });
  };

  let handleSave = () => {
    if (saveImg.current) {
      saveImg.current.src = "../images/heart-white-filled.png";
    }
    let savedTrades = localStorage.getItem("savedTrades");
    if (savedTrades === null) {
      localStorage.setItem("savedTrades", JSON.stringify([tradeResult.id]));
    } else {
      let savedTradesParsed = JSON.parse(savedTrades);
      if (savedTradesParsed.includes(tradeResult.id)) {
        return; // already saved
      }
      savedTradesParsed.push(tradeResult.id);
      localStorage.setItem("savedTrades", JSON.stringify(savedTradesParsed));
    }
  };

  return (
    <div className={styles.container}>
      <Header
        buttonProps={{
          text: "View Saved",
          icon: "../images/heart.png",
          onClick: handleViewSaved,
        }}
      />
      <div className={styles.tradeContainer}>
        <div className={styles.tradeHeader}>
          {tradeResult.isTradeValid ? (
            <img
              className={styles.tradeIcon}
              src="../images/success-check.svg"
            ></img>
          ) : (
            <img className={styles.tradeIcon} src="../images/fail-x.png"></img>
          )}
          <div className={styles.tradeHeaderTitle}>
            Trade {tradeResult.isTradeValid ? "Works" : "Failed"}
          </div>
          {tradeResult.isTradeValid === false && (
            <div className={styles.tradeSubTitle}>
              {tradeResult.tradeFailedReason}
            </div>
          )}
          <div className={styles.buttonsContainer}>
            <button className={styles.tradeButton} onClick={handleRestart}>
              <span>Restart</span>
              <img src="../images/restart-white.png" />
            </button>
            <button className={styles.tradeButton} onClick={handleEdit}>
              <span>Edit</span>
              <img src="../images/swap-white.png" />
            </button>
            <button className={styles.tradeButton} onClick={handleSave}>
              <span>Save</span>
              <img ref={saveImg} src="../images/heart-white.png" />
            </button>
          </div>
        </div>
        <div className={styles.tradeTeams}>
          {tradeResult.trade.teams.map((team, index) => {
            return (
              <div key={index} className={styles.tradeTeam}>
                <TeamPreview
                  team={team}
                  selectedPlayers={tradeResult.trade.playersInTrade.filter(
                    (player) => player.toTeamName == team.teamName
                  )}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    let db = new DatabaseClient();
    let tradeResult = await db.GetTrade(context.query["id"] as string);
    if (tradeResult === null || tradeResult === undefined) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        tradeResult: JSON.parse(JSON.stringify(tradeResult)),
      },
    };
  } catch (error) {
    console.log(error);
    return {
      notFound: true,
    };
  }
};

export default TradeResultsFromId;
