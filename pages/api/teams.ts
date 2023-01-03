import type { NextApiRequest, NextApiResponse } from 'next'
import DatabaseClient from '../../data/Database'
import Team from '../../model/Team'

const db = new DatabaseClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {

    if(req.method === 'PUT') {
    let teamJson = req.body
    let team = new Team(teamJson.teamName, teamJson.city, teamJson.taxSpace, teamJson.capSpace,
        teamJson.conference, teamJson.hardCap, teamJson.tradeExceptions, teamJson.players)

    db.UpdateTeam(team)
    return res.status(200).json("Team Updated")
    }

  if(req.method === 'POST') {
    let teamJson = req.body

    let team = new Team(teamJson.teamName, teamJson.city, teamJson.taxSpace, teamJson.capSpace,
        teamJson.conference, teamJson.hardCap)

    db.AddTeam(team)
    return res.status(200).json("Team Added")
  }

  if(req.method === 'GET') {
    if(req.query.teamName !== undefined) {
      let team = await db.GetTeam(req.query.teamName as string)
      return res.status(200).json(team)
    }

    let teams = await db.GetTeams();
    return res.status(200).json(teams)
  }
  return res.status(404).json(null)
}
