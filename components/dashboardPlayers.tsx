import Head from "next/head";
import { useEffect, useState } from "react";
import { DraftPlayer } from "../model/DraftPlayer";
import Player from "../model/Player";
import PlayerType from "../model/playerTypes";
import { RosterPlayer } from "../model/RosterPlayer";
import styles from "../styles/Dashboard.module.css";

export const DashboardPlayer = ({initPlayer, deletePlayer}: {initPlayer: Player, deletePlayer: (player: RosterPlayer | DraftPlayer | Player) => void}) => {

    const [player, setPlayer] = useState(initPlayer);
    const [rosterPlayer, setRosterPlayer] = useState<RosterPlayer>();
    const [draftPlayer, setDraftPlayer] = useState<DraftPlayer>();

  
    let asCurrency = (num: number): string => {
        return "$" + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      };

    let handleDelete = () => {
        let playerToDelete = rosterPlayer ? rosterPlayer : draftPlayer ?? player;
        deletePlayer(playerToDelete);
    }

    useEffect(() => {
        if (player.playerType === PlayerType.RosterPlayer) {
            setRosterPlayer(player as RosterPlayer);
        }
        else if (player.playerType === PlayerType.DraftPlayer) {
            setDraftPlayer(player as DraftPlayer);
        }
    }, [player]);

    return (
    <div className={styles.playerContainer}>
        {rosterPlayer && (
        <div className={styles.player}>
            <div className={styles.playerStat} >Name: {rosterPlayer.firstName} {rosterPlayer.lastName}</div>
            <div className={styles.playerStat} >Incoming: {asCurrency(Number(rosterPlayer.incomingSalary))}</div>
            <div className={styles.playerStat} >Outgoing: {asCurrency(Number(rosterPlayer.outgoingSalary))}</div>
            <div className={styles.playerStat} >Trade Kicker: {asCurrency(Number(rosterPlayer.tradeKicker))}</div>
            <div className={styles.playerStat} >Can't Trade Until: {String(rosterPlayer.cannotTradeUntilDate)}</div>
            <div className={styles.playerStat} >Can't Trade With Others: {String(rosterPlayer.cannotTradeWithOtherPlayersUntilDate)}</div>
            <div className={styles.playerStat} >Two Way: {String(rosterPlayer.isTwoWay)}</div>
            <div className={styles.playerStat} >Poison Pill: {String(rosterPlayer.isPoisonPill)}</div>
            <div className={styles.playerStat} >Upcoming Free Agent: {String(rosterPlayer.isUpcomingFreeAgent)}</div>
            <div className={styles.playerStat} >Player Option: {String(rosterPlayer.hasPlayerOption)}</div>
            <div className={styles.playerStat} >Team Option: {String(rosterPlayer.hasTeamOption)}</div>
            <div className={styles.playerStat} >Teams Can't Be Traded To: {rosterPlayer.teamsCannotBeTradedTo.join(", ")}</div>
        </div>
        )}
        {draftPlayer && (
        <div className={styles.player}>
            <div className={styles.playerStat} >Name:</div>
            <div className={styles.playerStat} > {draftPlayer.firstName}</div>
            {draftPlayer.isDraftPick && <div className={styles.playerStat} >Can Protect:</div>}
            {draftPlayer.isDraftPick && <div className={styles.playerStat} > {draftPlayer?.canProtect === true ? "True" : "False" ?? "None"}</div>}
        </div>
        )}
        <button className={styles.deleteButton} onClick={() => handleDelete()}>Delete Player</button>
    </div>
    );
};


export default DashboardPlayer;