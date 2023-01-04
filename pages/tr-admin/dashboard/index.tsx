import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import DatabaseClient from '../../../data/Database';
import Player from '../../../model/Player';
import PlayerType from '../../../model/playerTypes';
import { RosterPlayer } from '../../../model/RosterPlayer';
import Team from '../../../model/Team';
import styles from '../../../styles/Dashboard.module.css';

const Dashboard = ({initialTeams}: {initialTeams: Array<Team>}) => {

    const [teams, setTeams] = useState<Array<Team>>(initialTeams);

    let handleAddTeam = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let teamName = e.currentTarget.teamName.value;
        let teamCity = e.currentTarget.teamCity.value;
        let teamConference = e.currentTarget.teamConference.value;
        let capSpace = e.currentTarget.capSpace.value;
        let taxSpace = e.currentTarget.taxSpace.value;
        let hardCap = e.currentTarget.hardCap.value;
        let team = new Team(teamName, teamCity, Number(taxSpace), Number(capSpace), teamConference, hardCap.toLowerCase() === 'true' ? true : false, [], []);

        let response = await fetch('/api/teams', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(team)
        })
        if(response.status === 200) {
            let allTeams = await fetch('/api/teams');
            let teamsJson = await allTeams.json();
            setTeams(teamsJson as Array<Team>);
            console.log('Team added successfully')
        }
        if(response.status === 400) {
            console.log('Team already exists')
        }
    }
    
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
            <h1>Dashboard</h1>
            <div className={styles.teamsContainer}>
                { teams && teams.map((team, idx) => {
                    return (<Link href={`./dashboard/${team.teamName}`} className={styles.teamButton} key={idx}>
                                {team.teamName}
                            </Link>)
                })}
            </div>
            <div className={styles.teamForm}>
            <form className="form-group" onSubmit={handleAddTeam}>
                <h1>Add Team</h1>
                <label htmlFor="teamName">Team Name</label>
                <input className="form-control" type="text" name="teamName" id="teamName" />
                <label htmlFor="teamCity">Team City</label>
                <input className="form-control" type="text" name="teamCity" id="teamCity" />
                <label htmlFor="teamConference">Team Conference</label>
                <input className="form-control" type="text" name="teamConference" id="teamConference" />
                <label htmlFor="capSpace">Cap Space</label>
                <input className="form-control" type="number" name="capSpace" id="capSpace" />
                <label htmlFor="taxSpace">Tax Space</label>
                <input className="form-control" type="number" name="taxSpace" id="taxSpace" />
                <label htmlFor="hardCap">Hard Cap</label>
                <input className="form-control" type="text" placeholder='True or False' name="hardCap" id="hardCap" />
            <button className="btn btn-primary" value="Submit">Add Team</button>
            </form>
            </div>
            {/* <div className={styles.playerContainer}> */}
            {/* { rosterPlayers !== undefined &&
                rosterPlayers.map((player, idx) => {
                    let rosterPlayer = player as RosterPlayer;
                    return (
                        <div className={styles.player}>
                            {
                                Object.keys(rosterPlayer).map((key) => {
                                    return (
                                        key !== "profileImage" && key !== "playerType"  && <div className={styles.playerStat}>{rosterPlayer[key]}</div>
                                    );
                                })
                            }
                        </div>
                    );
                })
            } */}
            {/* </div> */}
        </div>
    );
};

export default Dashboard;


export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/tr-admin',
                permanent: false,
            }   
        }
    }

    const db = new DatabaseClient();
    let teams = await db.GetTeams();

    return {
        props: {initialTeams: teams}
    };
}