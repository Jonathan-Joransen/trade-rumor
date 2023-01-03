import type { NextApiRequest, NextApiResponse } from 'next'
import Trade from '../../model/Trade'
import { RosterPlayer } from '../../model/RosterPlayer'
import Database from '../../data/Database'
import TradeResult from '../../model/TradeResult'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
    let db = new Database()
    if(req.method === 'POST') {
    let tradeJson = req.body
    let teams = tradeJson.teams
    let players = tradeJson.players
    
    let trade = new Trade(players, teams)

    let isTradeValid = trade.isValidTrade()
    let tradeResult = new TradeResult(trade, isTradeValid, isTradeValid ? "" : trade.failedReasonMessage)
    await db.AddTrade(tradeResult)
    return res.status(200).json({isTradeValid: isTradeValid, tradeId: tradeResult.id})
  }

  if(req.method === 'GET') {
    let id = req.query.id as string
    let tradeResults = await db.GetTrade(id)
    if (tradeResults === undefined) {
      return res.status(404).json({message: "Trade not found"})
    }
    return res.status(200).json(tradeResults)
  }
}
