import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { Header } from "../../components/header";
import { TeamPreview } from "../../components/teamPreview";
import TeamRoster from "../../components/teamRoster";
import DatabaseClient from "../../data/Database";
import Cash from "../../model/Cash";
import { PlayerInTrade } from "../../model/PlayerInTrade";
import Team from "../../model/Team";
import styles from "../../styles/Trading.module.css";

export const Trading = ({ teams }: { teams: Team[] }): React.ReactNode => {
  let router = useRouter();
  const [selectedPlayers, setSelectedPlayers] = useState(new Array<PlayerInTrade>());
  const [activeTeams, setActiveTeams] = useState(teams);

  const teamNames = teams.map((team) => team.teamName);
    
  let handleChangeTeams = () => {
      router.push({
          pathname: "/trade",
          query: { 
              teamNames: JSON.stringify(teamNames) 
          },
      });
  }

  let addSelectedPlayer = (player: PlayerInTrade) => {
    setSelectedPlayers((prev: PlayerInTrade[]) => {
      let newSelectedPlayers = [...prev, player];
      return newSelectedPlayers;
    });
  };

  let removeSelectedPlayer = (player: PlayerInTrade) => {
    setSelectedPlayers((prev: PlayerInTrade[]) => {
      return prev.filter((p) => (p.player !== player.player));
    });
  };

  let tryTrade = async () => {
    let response = await fetch('/api/trade', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        teams: activeTeams,
        players: selectedPlayers
      })
  })

  let data = await response.json();
  router.push({pathname: "/trading/" + data.tradeId});
}


  return (
    <div className={styles.container}>
      <Header
        buttonProps={{
          text: "Change Teams",
          icon: "../images/retweet-white.png",
          onClick: handleChangeTeams
        }}
      ></Header>
      <div className={styles.teamsContainer} data-teams={teams.length}>
        {teams !== undefined && (
          <>
            {teams.map((team, idx) => (
              <div key={idx * 33}>
                <TeamPreview
                  team={team}
                  selectedPlayers={selectedPlayers}
                ></TeamPreview>
              </div>
            ))}
          </>
        )}
        {teams !== undefined && (
          <>
            {teams.map((team, idx) => (
              <TeamRoster
                key={idx * 19}
                team={team}
                teamNames={teamNames}
                selectedPlayers={selectedPlayers}
                addSelectedPlayer={addSelectedPlayer}
                removeSelectedPlayer={removeSelectedPlayer}
                players={team.players}
              ></TeamRoster>
            ))}
          </>
        )}
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.tradeButton} onClick={() => tryTrade()}>Try Trade</button>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    let teamNames: string[] = JSON.parse(context.query["teamNames"] as string);

    const db = new DatabaseClient();
    let allTeams = await db.GetTeams();

    let teams = allTeams.filter((team: Team) =>
      teamNames.includes(team.teamName)
    );

    for(let team of teams) {
      team.players.push(new Cash(team.teamName))
    }
    
    return {
      props: {
        teams: JSON.parse(JSON.stringify(teams)),
      },
    };
  } 
  catch (error) {
      console.log(error);
      return {
          notFound: true,
      }
  };
};

export default Trading;
