import React, { useEffect } from "react";
import Team from "../model/Team";
import styles from "../styles/PickTeam.module.css";

const PickTeam = ({ team, handleClick, selectedTeams }: { team: Team; handleClick: any, selectedTeams: Team[] }) => {
  const content = React.createRef();

  useEffect(() => {
    let isTeamSelected = selectedTeams.filter((selectedTeam: Team) => selectedTeam.teamName === team.teamName).length > 0;
    const c = content.current as HTMLDivElement;
    if (isTeamSelected) {
      c.classList.add(styles.selected);
    }
  }, []);

  let toggleSelect = () => {
    handleClick();
    let isTeamSelected = selectedTeams.filter((selectedTeam: Team) => selectedTeam.teamName === team.teamName).length > 0;
      const c = content.current as HTMLDivElement;
      if (isTeamSelected) {
        c.classList.remove(styles.selected);
      } 
      if (!isTeamSelected && selectedTeams.length < 4) {
        c?.classList.add(styles.selected);
      }
    }

  return (
    <div
      className={styles.container}
      ref={content as React.RefObject<HTMLImageElement>}
      onClick={toggleSelect}
    >
      <img className={styles.teamLogo} src={team.logoPath}></img>
      <h1 className={styles.teamName}>{team.teamName}</h1>
    </div>
  );
};

export default PickTeam;
