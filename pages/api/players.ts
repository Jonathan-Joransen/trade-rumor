// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import DatabaseClient from '../../data/Database'
import { RosterPlayer } from '../../model/RosterPlayer'

const db = new DatabaseClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if(req.method === 'POST') {
    db.AddPlayer(new RosterPlayer("John", "Doe", "Lakers", 10000000, 10000000))
    return res.status(200).json({name: "Player added"})
  }
  if(req.method === 'GET') {
    let players = await db.GetPlayers();
    return res.status(200).json(players)
  }
  return res.status(200).json({ name: 'John Doe' })
}
