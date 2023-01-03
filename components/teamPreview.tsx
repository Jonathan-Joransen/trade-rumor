import { useEffect, useState } from "react";
import { PlayerInTrade } from "../model/PlayerInTrade";
import PlayerType from "../model/playerTypes";
import Team from "../model/Team";
import styles from "../styles/TeamPreview.module.css";

export const TeamPreview = ({
  team,
  selectedPlayers,
}: {
  team: Team;
  selectedPlayers: PlayerInTrade[];
}) => {
  const [acquiringAmmount, setAcquiringAmmount] = useState(0);

  useEffect(() => {
    let ammount = 0;
    for (let playerInTrade of selectedPlayers) {
      if (playerInTrade.toTeamName === team.teamName) {
        ammount += playerInTrade.player.incomingSalary;
      }
    }
    setAcquiringAmmount(ammount);
  }, [selectedPlayers]);

  let asCurrency = (num: number): string => {
    return "$" + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  return (
    <div className={styles.container}>
      <div className={styles.teamHeader}>
        <div className={styles.teamName}>{team.teamName} Trade Preview</div>
        <img
          src={team.logoPath}
          alt={team.teamName}
          className={styles.teamLogo}
        ></img>
      </div>
      <div className={styles.teamStats}>
        <div className={styles.teamStat}>
          Cap Space: {asCurrency(Number(team.capSpace))}
        </div>
        <div className={styles.teamStat}>
          Tax Space: {asCurrency(Number(team.taxSpace))}
        </div>
        <div className={styles.teamStat}>
          Acquiring: {asCurrency(Number(acquiringAmmount))}
        </div>
      </div>
      <div className={styles.playerContainer}>
        {selectedPlayers !== undefined && 
          <>
            {selectedPlayers
              .filter((player) => player.toTeamName === team.teamName)
              .map((playerInTrade, idx) => (
                <div key={idx} className={styles.player}>
                  <img
                    className={styles.profileImage}
                    src={playerInTrade.player.profileImage}
                  ></img>
                  <div className={styles.playerName}>
                    {
                    playerInTrade.player.playerType === PlayerType.RosterPlayer ?
                    `${playerInTrade.player.firstName[0]}. ${playerInTrade.player.lastName}` :
                    `${playerInTrade.player.playerName}`
                    }
                  </div>
                </div>
              ))}
          </>
        }
      </div>
    </div>
  );
};
