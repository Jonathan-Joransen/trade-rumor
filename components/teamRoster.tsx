import { PlayerInTrade } from "../model/PlayerInTrade";
import Team from "../model/Team";
import Dropdown from "./dropdown";
import styles from "../styles/TeamRoster.module.css";
import Player from "../model/Player";
import { RosterPlayer } from "../model/RosterPlayer";
import { DraftPlayer } from "../model/DraftPlayer";
import PlayerType from "../model/playerTypes";
import PlayerSelectionList from "./PlayerSelectionList";
import {
  ConvertTradeExceptionsToPlayers,
  ConvertDisabledPlayerExceptionsToPlayers,
} from "../model/TradeExceptionAsPlayer";
import { TradeOrDisabledPlayerExceptionTypes } from "../model/TradeException";
import Cash from "../model/Cash";

export const TeamRoster = ({
  team,
  players,
  selectedPlayers,
  teamNames,
  addSelectedPlayer,
  removeSelectedPlayer,
}: {
  team: Team;
  teamNames: Array<string>;
  players: Player[];
  selectedPlayers: Array<PlayerInTrade>;
  addSelectedPlayer: (player: PlayerInTrade) => void;
  removeSelectedPlayer: (player: PlayerInTrade) => void;
}) => {
  // Set RosterPlayers
  let rosterPlayers = players.filter(
    (player) =>
      (player.playerType === PlayerType.RosterPlayer || player.playerType === PlayerType.Cash) && player.isTwoWay === false
  );

    // Set TwoWayPlayers
  let twoWayPlayers = players.filter(
    (player) => player.playerType === PlayerType.RosterPlayer && player.isTwoWay
  );

  // Set DraftPlayers
  let draftPlayers: DraftPlayer[] = players.filter(
    (player) => player.playerType === PlayerType.DraftPlayer
  ) as DraftPlayer[];
  let draftRights = draftPlayers.filter(
    (player) =>
      player.playerType === PlayerType.DraftPlayer && player.isDraftRights
  );
  let draftPicks = draftPlayers.filter(
    (player) =>
      player.playerType === PlayerType.DraftPlayer && player.isDraftPick
  );

  // Set TradeExceptions
  let tradeExceptionsAsPlayers = ConvertTradeExceptionsToPlayers(
    team.tradeExceptions
      .filter(
        (te) =>
          te.exceptionType ===
          TradeOrDisabledPlayerExceptionTypes.TradeException
      )
      .map((te) => te.ammount),
    team.teamName
  );

  // Set DisabledPlayerExceptions
  let disabledPlayerExceptionsAsPlayers =
    ConvertDisabledPlayerExceptionsToPlayers(
      team.tradeExceptions
        .filter(
          (te) =>
            te.exceptionType ===
            TradeOrDisabledPlayerExceptionTypes.DisabledPlayerException
        )
        .map((te) => te.ammount),
      team.teamName
    );

  return (
    <div className={styles.container}>
      {players !== undefined && (
        <Dropdown title={`${team.teamName}`} titleSize="small">
          <PlayerSelectionList
            isSelectable={true}
            fields={rosterPlayers}
            teamNames={teamNames}
            selectedPlayers={selectedPlayers}
            addSelectedPlayer={addSelectedPlayer}
            removeSelectedPlayer={removeSelectedPlayer}
            title="Roster"
          />
          <PlayerSelectionList
            isSelectable={true}
            fields={twoWayPlayers}
            teamNames={teamNames}
            selectedPlayers={selectedPlayers}
            addSelectedPlayer={addSelectedPlayer}
            removeSelectedPlayer={removeSelectedPlayer}
            title="Two Way Players"
          />
          <PlayerSelectionList
            isSelectable={true}
            fields={draftRights}
            teamNames={teamNames}
            selectedPlayers={selectedPlayers}
            addSelectedPlayer={addSelectedPlayer}
            removeSelectedPlayer={removeSelectedPlayer}
            title="Draft Rights"
          />
          <PlayerSelectionList
            isSelectable={true}
            fields={draftPicks}
            teamNames={teamNames}
            selectedPlayers={selectedPlayers}
            addSelectedPlayer={addSelectedPlayer}
            removeSelectedPlayer={removeSelectedPlayer}
            title="Draft Picks"
          />
          <PlayerSelectionList
            isSelectable={false}
            teamNames={teamNames}
            selectedPlayers={selectedPlayers}
            addSelectedPlayer={null}
            removeSelectedPlayer={null}
            fields={tradeExceptionsAsPlayers}
            title="Trade Exceptions"
          />
          <PlayerSelectionList
            isSelectable={false}
            teamNames={teamNames}
            selectedPlayers={selectedPlayers}
            addSelectedPlayer={null}
            removeSelectedPlayer={null}
            fields={disabledPlayerExceptionsAsPlayers}
            title="Disabled Player Exceptions"
          />
        </Dropdown>
      )}
    </div>
  );
};

export default TeamRoster;
