import { GetServerSideProps } from "next";
import { getSession, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import Team from "../../model/Team";
import PlayerType from "../../model/playerTypes";
import TradeOrDisabledPlayerException, {
  TradeOrDisabledPlayerExceptionTypes,
} from "../../model/TradeException";
import styles from "../../styles/EditTeam.module.css";
import dashStyles from "../../styles/Dashboard.module.css";
import { RosterPlayer } from "../../model/RosterPlayer";
import { DraftPlayer } from "../../model/DraftPlayer";
import DashboardPlayer from "../../components/dashboardPlayers";
import Player from "../../model/Player";
import { DashboardExceptions } from "../../components/dashboardException";
import DatabaseClient from "../../data/Database";
import Link from "next/link";
import { useRouter } from "next/router";
import { PopUpOptions } from "../../model/PopUpOptions";
import PopUp from "../../components/popup";


const EditTeam = ({ initialTeam }: { initialTeam: Team }) => {
  const [team, setTeam] = useState(initialTeam);
  const [showTradeException, setShowTradeException] = useState(false);
  const [showAddDraftPlayer, setShowAddDraftPlayer] = useState(false);
  const [showAddRosterPlayer, setShowAddRosterPlayer] = useState(false);
  const [showEditTeam, setShowEditTeam] = useState(false);
  const router = useRouter();
  const [showPage, setShowPage] = useState(false);
  const [popUpUserInput, setPopUpUserInput] = useState("");

  let updatePopUpUserInput = (input: string): void => {
    setPopUpUserInput(input);
  };

  const defaultPopUpProps = new PopUpOptions("", "", [], updatePopUpUserInput);
  const [popUpOptions, setPopUpOptions] = React.useState(defaultPopUpProps);

  useEffect(() => {
    let data = localStorage.getItem("tr-admin");
    if (!data) {
      router.push("/tr-admin/signin");
    } else {
      setShowPage(true);
    }
  }, []);

  let asCurrency = (num: number): string => {
    return "$" + num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  };

  let addPlayer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.teamsCannotBeTradedTo.value)
    let teamsCannotBeTradedTo =
      e.currentTarget.teamsCannotBeTradedTo.value === undefined ||
      e.currentTarget.teamsCannotBeTradedTo.value === ""
        ? []
        : e.currentTarget.teamsCannotBeTradedTo.value.split(",");
    let player = new RosterPlayer(
      e.currentTarget.firstName.value,
      e.currentTarget.lastName.value,
      e.currentTarget.teamName.value,
      Number(e.currentTarget.incomingSalary.value),
      Number(e.currentTarget.outgoingSalary.value),
      Number(e.currentTarget.tradeKicker.value),
      e.currentTarget.cannotTradeUntilDate.value === "null"
        ? null
        : e.currentTarget.cannotTradeUntilDate.value,
      e.currentTarget.cannotTradeWithOtherPlayersUntilDate.value === "null"
        ? null
        : e.currentTarget.cannotTradeWithOtherPlayersUntilDate.value,
      e.currentTarget.isTwoWay.value.toLowerCase() === "true" ? true : false,
      e.currentTarget.isPoisonPill.value.toLowerCase() === "true"
        ? true
        : false,
      e.currentTarget.isUpcomingFreeAgent.value.toLowerCase() === "true"
        ? true
        : false,
      e.currentTarget.hasPlayerOption.value.toLowerCase() === "true"
        ? true
        : false,
      e.currentTarget.hasTeamOption.value.toLowerCase() === "true"
        ? true
        : false,
      teamsCannotBeTradedTo
    );

    await setTeam((prevTeam) => {
      let newTeam = { ...prevTeam, players: [...prevTeam.players, player] };
      editTeam(newTeam);
      return newTeam;
    });
  };

  let getPopUpUserInput = async (popUpOptions: PopUpOptions) => {
    setPopUpOptions(popUpOptions);
    return await getPopUpValue();
  };

  let deletePlayer = async (player: RosterPlayer | DraftPlayer | Player) => {
    let shouldDeleteInput = await getPopUpUserInput(
      new PopUpOptions(`Are you sure you want to delete ${player.playerName}?`, 
        "This action cannot be undone.",
        ["Cancel", "Delete"],
        updatePopUpUserInput));

    // If the user clicks cancel, do nothing
    if (shouldDeleteInput === "Cancel") {
      return;
    }

    // If the user clicks delete, delete the player
    await setTeam((prevTeam) => {
      let newTeam = {
        ...prevTeam,
        players: prevTeam.players.filter((p) => p !== player),
      };
      editTeam(newTeam);
      return newTeam;
    });
  };

  let deleteException = async (exception: TradeOrDisabledPlayerException) => {
    await setTeam((prevTeam) => {
      let newTeam = {
        ...prevTeam,
        tradeExceptions: prevTeam.tradeExceptions.filter(
          (ex) => ex !== exception
        ),
      };
      editTeam(newTeam);
      return newTeam;
    });
  };

  let addDraftPlayer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isDraftPick =
      e.currentTarget.draftType.value === "DraftPick" ? true : false;
    let draftPlayer = new DraftPlayer(
      e.currentTarget.playerName.value,
      team.teamName,
      isDraftPick,
      e.currentTarget.canProtect.value === "true" ? true : false,
    );

    await setTeam((prevTeam) => {
      let newTeam = {
        ...prevTeam,
        players: [...prevTeam.players, draftPlayer],
      };
      editTeam(newTeam);
      return newTeam;
    });
  };

  let addTradeExceptions = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let newTradeException = new TradeOrDisabledPlayerException(
      e.currentTarget.exceptionType.value,
      e.currentTarget.ammount.value
    );

    await setTeam((prevTeam) => {
      let newTeam = {
        ...prevTeam,
        tradeExceptions: [...prevTeam.tradeExceptions, newTradeException],
      };
      editTeam(newTeam);
      return newTeam;
    });
  };

  let updateTeam = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let teamName = e.currentTarget.teamName.value;
    let teamCity = e.currentTarget.teamCity.value;
    let teamConference = e.currentTarget.teamConference.value;
    let capSpace = e.currentTarget.capSpace.value;
    let taxSpace = e.currentTarget.taxSpace.value;
    let hardCap = e.currentTarget.hardCap.value === "true" ? true : false;
    let taxApron = Number(e.currentTarget.taxSpace.value) + Number(6000000);
    await setTeam((prevTeam) => {
      let newTeam = {
        ...prevTeam,
        teamName: teamName,
        teamCity: teamCity,
        teamConference: teamConference,
        capSpace: Number(capSpace),
        taxSpace: Number(taxSpace),
        hardCap: hardCap,
        taxApron: taxApron,
      };
      editTeam(newTeam);
      return newTeam;
    });
  };

  let editTeam = async (team: Team) => {
    let response = await fetch(`/api/teams`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(team),
    });
    if (response.status === 200) {
      console.log("Team edited successfully");
    }
    if (response.status === 400) {
      console.log("Something went wrong");
    }
  };

  let handleSignOut = async () => {
    // await signOut({redirect: false});
    localStorage.removeItem("tr-admin");
    router.push("/tr-admin/signin");
  };
  
  const [getPopUpValue, PopUpUi] = PopUp({
    props: popUpOptions,
    children: null,
  });

  return (
    <div className={styles.container}>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
          crossOrigin="anonymous"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {showPage && (
        <>
        <PopUpUi />
          <div className={dashStyles.header}>
            <Link href="/tr-admin">
              <h1>Dashboard</h1>
            </Link>
            <button
              className={dashStyles.signOutButton}
              type="submit"
              onClick={() => handleSignOut()}
            >
              Log Out
            </button>
          </div>
          {team && (
            <div className={styles.teamContainer}>
              <div className={styles.teamMain}>
                <div className={styles.teamInfo}>
                  Team Name: {team.teamName}
                </div>
                <div className={styles.teamInfo}>Team City: {team.city}</div>
                <div className={styles.teamInfo}>
                  Conference: {team.conference}
                </div>
                <div className={styles.teamInfo}>
                  Tax Space: {asCurrency(Number(team.taxSpace))}
                </div>
                <div className={styles.teamInfo}>
                  Tax Apron: {asCurrency(Number(team.taxApron))}
                </div>
                <div className={styles.teamInfo}>
                  Cap Space: {asCurrency(Number(team.capSpace))}
                </div>
                <div className={styles.teamInfo}>
                  Hard Cap: {String(team.hardCap)}
                </div>
              </div>
              <DashboardExceptions
                allTradeExceptions={team.tradeExceptions}
                deleteException={deleteException}
              ></DashboardExceptions>
              <div className={styles.playersContainer}>
                <div className={styles.playersHeader}> Players </div>
                <div className={styles.playersWrapper}>
                  {team.players.length > 0 ? (
                    team.players.map((player, idx) => (
                      <DashboardPlayer
                        key={idx}
                        deletePlayer={deletePlayer}
                        initPlayer={player}
                      />
                    ))
                  ) : (
                    <div className={styles.playersHeader}>No Players</div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className={styles.addButtonsContainer}>
            <button
              className={dashStyles.addTeamButton}
              onClick={() => setShowTradeException((prevTeam) => !prevTeam)}
            >
              <img src="../../images/plus (1) white.png"></img>Add Trade
              Exception
            </button>
            {showTradeException && (
              <div className={dashStyles.teamFormContainer}>
                <div className={dashStyles.teamForm}>
                  <button
                    className={dashStyles.closeFormButton}
                    onClick={() => setShowTradeException(false)}
                  >
                    <img src="../../images/fail-x.png"></img>
                  </button>
                  <form className="form-group" onSubmit={addTradeExceptions}>
                    <h1>Add Trade Exception</h1>
                    <label htmlFor="ammount">Ammount</label>
                    <input
                      className="form-control"
                      type="number"
                      name="ammount"
                      id="ammount"
                    />
                    <label htmlFor="exceptionType">Exception Type</label>
                    <select
                      className="form-control"
                      name="exceptionType"
                      id="exceptionType"
                    >
                      <option
                        value={
                          TradeOrDisabledPlayerExceptionTypes.DisabledPlayerException
                        }
                      >
                        Disabled Player Exception
                      </option>
                      <option
                        value={
                          TradeOrDisabledPlayerExceptionTypes.TradeException
                        }
                      >
                        Trade Exception
                      </option>
                    </select>
                    <button className="btn btn-primary" value="Submit">
                      Add Exception
                    </button>
                  </form>
                </div>
              </div>
            )}
            <button
              className={dashStyles.addTeamButton}
              onClick={() => setShowAddDraftPlayer((prevTeam) => !prevTeam)}
            >
              <img src="../../images/plus (1) white.png"></img>Add Draft Player
              Or Pick
            </button>
            {showAddDraftPlayer && (
              <div className={dashStyles.teamFormContainer}>
                <div className={dashStyles.teamForm}>
                  <button
                    className={dashStyles.closeFormButton}
                    onClick={() => setShowAddDraftPlayer(false)}
                  >
                    <img src="../../images/fail-x.png"></img>
                  </button>
                  <form className="form-group" onSubmit={addDraftPlayer}>
                    <h1>Add Draft Player Or Pick</h1>
                    <label htmlFor="playerName">Title</label>
                    <input
                      className="form-control"
                      type="text"
                      name="playerName"
                      id="playerName"
                    />
                    <label htmlFor="draftType">Draft Type</label>
                    <select
                      className="form-control"
                      name="draftType"
                      id="draftType"
                    >
                      <option value={"DraftPick"}>Draft Pick</option>
                      <option value={"DraftRights"}>
                        Draft Rights To Player
                      </option>
                    </select>
                    <label htmlFor="canProtect">Can Protect</label>
                    <select
                      className="form-control"
                      name="canProtect"
                      id="canProtect"
                    >
                      <option value={"true"}>True</option>
                      <option value={"false"}>False</option>
                    </select>
                    <button className="btn btn-primary" value="Submit">
                      Add Draft Player
                    </button>
                  </form>
                </div>
              </div>
            )}
            <button
              className={dashStyles.addTeamButton}
              onClick={() => setShowAddRosterPlayer((prevTeam) => !prevTeam)}
            >
              <img src="../../images/plus (1) white.png"></img>Add Roster Player
            </button>
            {showAddRosterPlayer && (
              <div className={dashStyles.teamFormContainer}>
                <div className={dashStyles.teamForm}>
                  <button
                    className={dashStyles.closeFormButton}
                    onClick={() => setShowAddRosterPlayer(false)}
                  >
                    <img src="../../images/fail-x.png"></img>
                  </button>
                  <form className="form-group" onSubmit={addPlayer}>
                    <h1>Add Roster Player</h1>
                    <input
                      type="hidden"
                      name="playerType"
                      value={PlayerType.RosterPlayer}
                    ></input>
                    <input
                      type="hidden"
                      name="teamName"
                      value={team.teamName}
                    ></input>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      className="form-control"
                      type="text"
                      name="firstName"
                      id="firstName"
                    />
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      className="form-control"
                      type="text"
                      name="lastName"
                      id="lastName"
                    />
                    <label htmlFor="incomingSalary">Incoming Salary</label>
                    <input
                      className="form-control"
                      type="number"
                      name="incomingSalary"
                      id="incomingSalary"
                    />
                    <label htmlFor="outgoingSalary">Outgoing Salary</label>
                    <input
                      className="form-control"
                      type="number"
                      name="outgoingSalary"
                      id="outgoingSalary"
                    />
                    <label htmlFor="tradeKicker">Trade Kicker</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="0"
                      name="tradeKicker"
                      id="tradeKicker"
                    />
                    <label htmlFor="cannotTradeUntilDate">
                      Cannot Trade Until Date
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="null"
                      name="cannotTradeUntilDate"
                      id="cannotTradeUntilDate"
                    />
                    <label htmlFor="cannotTradeWithOtherPlayersUntilDate">
                      Cannot Trade With Other Players Until Date
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="null"
                      name="cannotTradeWithOtherPlayersUntilDate"
                      id="cannotTradeWithOtherPlayersUntilDate"
                    />
                    <label htmlFor="isTwoWay">Is Two Way</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="true or false"
                      name="isTwoWay"
                      id="isTwoWay"
                    />
                    <label htmlFor="isPoisonPill">Is Poison Pill</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="true or false"
                      name="isPoisonPill"
                      id="isPoisonPill"
                    />
                    <label htmlFor="isUpcomingFreeAgent">
                      Is Upcoming Free Agent
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="true or false"
                      name="isUpcomingFreeAgent"
                      id="isUpcomingFreeAgent"
                    />
                    <label htmlFor="hasPlayerOption">Has Player Option</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="true or false"
                      name="hasPlayerOption"
                      id="hasPlayerOption"
                    />
                    <label htmlFor="hasTeamOption">Has Team Option</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="true or false"
                      name="hasTeamOption"
                      id="hasTeamOption"
                    />
                    <label htmlFor="teamsCannotBeTradedTo">
                      Team Player Cannot Be Traded To
                    </label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder='Ex: "Lakers,Knicks,Bucks"'
                      name="teamsCannotBeTradedTo"
                      id="teamsCannotBeTradedTo"
                    />
                    <button className="btn btn-primary" value="Submit">
                      Add Player
                    </button>
                  </form>
                </div>
              </div>
            )}
            <button
              className={dashStyles.addTeamButton}
              onClick={() => setShowEditTeam((prevTeam) => !prevTeam)}
            >
              <img src="../../images/plus (1) white.png"></img>Edit Team
            </button>
            {showEditTeam && (
              <div className={dashStyles.teamFormContainer}>
                <div className={dashStyles.teamForm}>
                  <button
                    className={dashStyles.closeFormButton}
                    onClick={() => setShowEditTeam(false)}
                  >
                    <img src="../../images/fail-x.png"></img>
                  </button>
                  <form className="form-group" onSubmit={updateTeam}>
                    <h1>Edit Team</h1>
                    <label htmlFor="teamName">Team Name</label>
                    <input
                      className="form-control"
                      type="text"
                      value={team.teamName}
                      name="teamName"
                      id="teamName"
                    />
                    <label htmlFor="teamCity">Team City</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder={team.city}
                      name="teamCity"
                      id="teamCity"
                    />
                    <label htmlFor="teamConference">Team Conference</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder={team.conference}
                      name="teamConference"
                      id="teamConference"
                    />
                    <label htmlFor="capSpace">Cap Space</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder={String(team.capSpace)}
                      name="capSpace"
                      id="capSpace"
                    />
                    <label htmlFor="taxSpace">Tax Space</label>
                    <input
                      className="form-control"
                      type="number"
                      placeholder={String(team.taxSpace)}
                      name="taxSpace"
                      id="taxSpace"
                    />
                    <label htmlFor="hardCap">Hard Cap</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder={String(team.hardCap)}
                      name="hardCap"
                      id="hardCap"
                    />
                    <button className="btn btn-primary" value="Submit">
                      Edit Team
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const db = new DatabaseClient();
  let team = await db.GetTeam(context?.params?.teamName as string);

  return {
    props: { initialTeam: team },
  };
};

EditTeam.auth = true;

export default EditTeam;
