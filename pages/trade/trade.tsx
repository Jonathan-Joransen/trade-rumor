import Dropdown from "../../components/dropdown";
import PickTeam from "../../components/pickTeam";
import styles from "../../styles/Trade.module.css";
import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Team from "../../model/Team";
import { useRouter } from "next/router";

const Trade = ({
  westTeams,
  eastTeams,
  selectedTeamNames,
}: {
  westTeams: Array<Team>;
  eastTeams: Array<Team>;
  selectedTeamNames: Array<string>;
}): React.ReactNode => {
  const router = useRouter();
  const [selectedTeams, setSelectedTeams] = useState(
    westTeams
      .concat(eastTeams)
      .filter((team: Team) => selectedTeamNames.includes(team.teamName))
  );

  let updateSelectedTeams = (team: Team) => {
    if (
      selectedTeams.filter(
        (selectedTeam: Team) => selectedTeam.teamName === team.teamName
      ).length > 0
    ) {
      return setSelectedTeams([
        ...selectedTeams.filter(
          (selectedTeam: Team) => selectedTeam.teamName !== team.teamName
        ),
      ]);
    }
    if (selectedTeams.length >= 4) {
      return alert("You can only select 4 teams");
    }
    return setSelectedTeams([...selectedTeams, team]);
  };

  let getTeams = (teams: Array<Team>): Array<React.ReactNode> => {
    let teamNodes: Array<React.ReactNode> = [];
    for (let team of teams) {
      teamNodes.push(
        <PickTeam
          handleClick={() => {
            updateSelectedTeams(team);
          }}
          selectedTeams={selectedTeams}
          team={team}
        ></PickTeam>
      );
    }
    return teamNodes;
  };

  let handleStartTrade = () => {
    if (selectedTeams.length < 2) {
      return alert("You must select 2-4 teams");
    }

    router.push({
      pathname: "/trading",
      query: {
        teamNames: JSON.stringify(selectedTeams.map((team) => team.teamName)),
      },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
      <h1 className={styles.title}>Pick Teams</h1>
      <Dropdown title="West">{getTeams(westTeams)}</Dropdown>
      <Dropdown title="East">{getTeams(eastTeams)}</Dropdown>
      <div className={styles.tradeButtonSpacer}></div>
      <div className={styles.buttonContainer}>
        <button className={styles.tradeButton} onClick={handleStartTrade}>
          <div className={styles.buttonTitle}>Start Trade</div>
          <div className={styles.teamIcons}>
            {selectedTeams?.length > 0 ? (
              selectedTeams.map((team) => (
                <img className={styles.teamIcon} src={team.logoPath}></img>
              ))
            ) : (
              <div className={styles.noTeams}>no teams</div>
            )}
          </div>
        </button>
      </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    let teamNames: string[] = JSON.parse(
      (context.query["teamNames"] as string) ?? "[]"
    );


      let response = await fetch(`/api/teams`)
      let allTeams = await response.json()
      let westTeams = allTeams.filter((team: Team) => team.conference.toLocaleLowerCase() === "west")
      let eastTeam = allTeams.filter((team: Team) => team.conference.toLocaleLowerCase() === "east")

    return {
      props: {
        westTeams: JSON.parse(JSON.stringify(westTeams)),
        eastTeams: JSON.parse(JSON.stringify(eastTeam)),
        selectedTeamNames: JSON.parse(JSON.stringify(teamNames)),
      },
    }
  } catch (error) {
    console.log(error);
    return {
        notFound: true,
    }
  };
};

export default Trade;
