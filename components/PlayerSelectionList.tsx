import { resolve } from "path";
import React, { useEffect } from "react";
import { DraftPlayer } from "../model/DraftPlayer";
import Player from "../model/Player";
import { PlayerInTrade } from "../model/PlayerInTrade";
import PlayerType from "../model/playerTypes";
import { PopUpOptions } from "../model/PopUpOptions";
import { RosterPlayer } from "../model/RosterPlayer";
import styles from "../styles/TeamRoster.module.css";
import Dropdown from "./dropdown";
import PopUp from "./popup";

export const PlayerSelectionList = ({
  isSelectable,
  title,
  fields,
  teamNames,
  addSelectedPlayer,
  removeSelectedPlayer,
  selectedPlayers,
}: {
  isSelectable: boolean;
  title: string;
  fields: Array<Player>;
  teamNames: Array<string>;
  selectedPlayers: Array<PlayerInTrade>;
  addSelectedPlayer: null | ((player: PlayerInTrade) => void);
  removeSelectedPlayer: null | ((player: PlayerInTrade) => void);
}): JSX.Element => {
  const [popUpUserInput, setPopUpUserInput] = React.useState("");
  const [showPopup, setShowPopup] = React.useState(false);
  const [showTeamPopUp, setShowTeamPopup] = React.useState(false);

  let updatePopUpUserInput = (input: string): void => {
    setPopUpUserInput(input);
  };

  const defaultPopUpProps = new PopUpOptions("", "", [], updatePopUpUserInput);
  const [popUpOptions, setPopUpOptions] = React.useState(defaultPopUpProps);

  let asMillions = (salary: number) => {
    return `$${(salary / 1000000).toFixed(1)}M`;
  };

  let onClick = async (player: Player, el: HTMLButtonElement) => {
    let isPlayerAlreadySelected =
      selectedPlayers.filter((p) =>
          p.player.playerName === player.playerName &&
          p.fromTeamName === player.teamName).length > 0;

          console.log(player)

    // Handle trade kicker
    if (!isPlayerAlreadySelected &&
      player.playerType === PlayerType.RosterPlayer &&
      (player as RosterPlayer).tradeKicker > 0) {
      let rosterPlayer = player as RosterPlayer;
      let userTradeKickerInput = await getPopUpUserInput(
        new PopUpOptions("Trade Kicker",
          `${rosterPlayer.firstName} ${
            rosterPlayer.lastName
          } has a trade kicker of ${asMillions(rosterPlayer.tradeKicker)}`,
          ["Decline", "Accept"],
          updatePopUpUserInput));

      // Accept adds the player with the trade kicker added to the incoming salary
      if (userTradeKickerInput === "Accept") {
        player.incomingSalary += rosterPlayer.tradeKicker;
      }
    }

    // Handle cannot trade until date
    if (!isPlayerAlreadySelected &&
      player.playerType === PlayerType.RosterPlayer &&
      (player as RosterPlayer).cannotTradeUntilDate !== null 
      && (player as RosterPlayer).cannotTradeUntilDate !== "null"
    ) {
      let rosterPlayer = player as RosterPlayer;
      let cannotTradeUserInput = await getPopUpUserInput(
        new PopUpOptions("Date Restriction",
          `${rosterPlayer.firstName} ${
            rosterPlayer.lastName
          } cannot be traded until ${rosterPlayer.cannotTradeUntilDate}. Do you wish to proceed?`,
          ["No", "Yes"],
          updatePopUpUserInput));
          if (cannotTradeUserInput === "No") {
            return el.classList.remove(styles.selectedPlayer);
          }
    }

    // Handle cannot trade with other players until date
    if (!isPlayerAlreadySelected &&
      player.playerType === PlayerType.RosterPlayer &&
      (player as RosterPlayer).cannotTradeWithOtherPlayersUntilDate !== null
      && (player as RosterPlayer).cannotTradeWithOtherPlayersUntilDate !== "null"
    ) {
      let rosterPlayer = player as RosterPlayer;
      let cannotTradeUserInput = await getPopUpUserInput(
        new PopUpOptions("Date Restriction",
          `${rosterPlayer.firstName} ${
            rosterPlayer.lastName
          } cannot be traded in combination with other players until ${rosterPlayer.cannotTradeWithOtherPlayersUntilDate}. Do you wish to proceed?`,
          ["No", "Yes"],
          updatePopUpUserInput));
          if (cannotTradeUserInput === "No") {
            return el.classList.remove(styles.selectedPlayer);
          }
    }

    // Handle player option
    if (!isPlayerAlreadySelected &&
      player.playerType === PlayerType.RosterPlayer &&
      (player as RosterPlayer).hasPlayerOption === true)
    {
      let rosterPlayer = player as RosterPlayer;
      let playerOptionUserInput = await getPopUpUserInput(
        new PopUpOptions("Player Option",
          `${rosterPlayer.firstName} ${rosterPlayer.lastName} has a player option. Do you accept or decline?`,
          ["Decline", "Accept"],
          updatePopUpUserInput));
      if (playerOptionUserInput === "Decline") {
        return el.classList.remove(styles.selectedPlayer);
      }
    }

    // Handle teams option
    if (!isPlayerAlreadySelected &&
      player.playerType === PlayerType.RosterPlayer &&
      (player as RosterPlayer).isUpcomingFreeAgent === true)
    {
      let rosterPlayer = player as RosterPlayer;
      let freeAgentUserInput = await getPopUpUserInput(
        new PopUpOptions("Upcoming Free Agent",
          `${rosterPlayer.firstName} ${rosterPlayer.lastName} is an upcoming free agent and cannot be traded.`,
          ["OK"],
          updatePopUpUserInput));
          if (freeAgentUserInput === "OK") {
            return el.classList.remove(styles.selectedPlayer);
          }
    }

    // Handle teams option
    if (!isPlayerAlreadySelected &&
      player.playerType === PlayerType.RosterPlayer &&
      (player as RosterPlayer).hasTeamOption === true)
    {
      let rosterPlayer = player as RosterPlayer;
      let teamOptionUserInput = await getPopUpUserInput(
        new PopUpOptions("Team Option",
          `${rosterPlayer.firstName} ${rosterPlayer.lastName} has a team option. Do you accept or decline?`,
          ["Decline", "Accept"],
          updatePopUpUserInput));
      if (teamOptionUserInput === "Decline") {
        return el.classList.remove(styles.selectedPlayer);
      }
    }

    // Handle cannont be traded with teams
    if (!isPlayerAlreadySelected &&
      player.playerType === PlayerType.RosterPlayer &&
      (player as RosterPlayer).teamsCannotBeTradedTo.length > 0)
    {
      let rosterPlayer = player as RosterPlayer;
      let teamOptionUserInput = await getPopUpUserInput(
        new PopUpOptions("Team Option",
          `${rosterPlayer.firstName} ${rosterPlayer.lastName} cannoted be traded to ${rosterPlayer.teamsCannotBeTradedTo.join(", ")}`,
          ["Cancel", "OK"],
          updatePopUpUserInput));
      if (teamOptionUserInput === "Cancel") {
        return el.classList.remove(styles.selectedPlayer);
      }
      if (teamOptionUserInput === "OK" 
      && teamNames.length === 2 
      && rosterPlayer.teamsCannotBeTradedTo.includes(teamNames.filter((t) => t !== player.teamName)[0])) {
        return el.classList.remove(styles.selectedPlayer);
      }
    }

    // Handle get team name
    let toTeam = "";
    if(!isPlayerAlreadySelected){
      if (teamNames.length === 2) {
        toTeam = teamNames.filter((t) => t !== player.teamName)[0];
      } else {
        let teamNamesToShow = teamNames;
        if (player.playerType === PlayerType.RosterPlayer && (player as RosterPlayer).teamsCannotBeTradedTo.length > 0) {
          teamNamesToShow = teamNames.filter((t) => !(player as RosterPlayer).teamsCannotBeTradedTo.includes(t));
        }
        teamNamesToShow = teamNamesToShow.filter((t) => t !== player.teamName);
        toTeam = await getPopUpUserInput(
          new PopUpOptions("Select Team", "Select the team to trade to", teamNamesToShow, updatePopUpUserInput));
      }  
    }

    // Handle draft player protection
    if (!isPlayerAlreadySelected &&
      player.playerType === PlayerType.DraftPlayer &&
      (player as DraftPlayer).canProtect === true)
    {
      let protectionLevel = await getPopUpUserInput(
        new PopUpOptions("Protect Draft Pick",
          "Select a protection level for the draft pick",
          ["Unprotected", "Top 4", "Top 5", "Top 8", "Top 10", "Lottery", "Top 20"],
          updatePopUpUserInput));
        (player as DraftPlayer).protectionLevel = protectionLevel;
    }

    if (isPlayerAlreadySelected && player.playerName !== "Cash") {
     toTeam = selectedPlayers.filter((p) => p.player.playerName === player.playerName)[0].toTeamName
    }

    // If no special cases then add or remove the player normally
    return addOrRemoveSelectedPlayer(player, el, toTeam);
  };

  let addOrRemoveSelectedPlayer = (player: Player, el: HTMLButtonElement, toTeam: string) => {
    let playerInSelectedPlayers = selectedPlayers.filter((p) =>
        p.player.playerName === player.playerName &&
        p.fromTeamName === player.teamName);
    if (selectedPlayers &&
      removeSelectedPlayer &&
      playerInSelectedPlayers.length > 0) {
      let playerInTrade = new PlayerInTrade(player, toTeam) ;
      removeSelectedPlayer(playerInTrade);
      el.classList.remove(styles.selectedPlayer);
    }
    if (
      selectedPlayers &&
      addSelectedPlayer &&
      toTeam &&
      playerInSelectedPlayers.length === 0
    ) {
      let playerInTrade = new PlayerInTrade(player, toTeam);
      addSelectedPlayer(playerInTrade);
      el.classList.add(styles.selectedPlayer);
    }
  };

  const [getPopUpValue, PopUpUi] = PopUp({
    props: popUpOptions,
    children: null,
  });

  let getPopUpUserInput = async (popUpOptions: PopUpOptions) => {
    setPopUpOptions(popUpOptions);
    return await getPopUpValue();
  };

  return (
    <Dropdown title={title} titleSize="extra-small">
      <PopUpUi />
      {fields.length > 0 ? (
        <>
          {isSelectable
            ? fields.map((player, idx) => (
                <button
                  className={styles.player}
                  key={idx}
                  onClick={(e) =>
                    onClick(player, e.currentTarget as HTMLButtonElement)
                  }
                >
                  <div className={styles.playerStat}>
                    {player.playerType === PlayerType.RosterPlayer
                      ? `${player.firstName[0]}. ${player.lastName}`
                      : player.playerName}
                  </div>
                  <div className={styles.playerStat}>
                    {asMillions(player.incomingSalary)}
                  </div>
                  {player.playerType === PlayerType.RosterPlayer &&
                    player.isPoisonPill && (
                      <div className={styles.playerStatPPP}>PPP</div>
                    )}
                </button>
              ))
            : fields.map((player, idx) => (
                <div className={styles.unSelectablePlayer} key={idx}>
                  <div className={styles.playerStat}>{player.playerName}</div>
                  <div className={styles.playerStat}>
                    {asMillions(player.incomingSalary)}
                  </div>
                </div>
              ))}
        </>
      ) : (
        <div className={styles.noStats} key={100192}>
          <div className={styles.playerStat}>None</div>
        </div>
      )}
    </Dropdown>
  );
};

export default PlayerSelectionList;
