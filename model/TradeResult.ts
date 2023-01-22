import Trade from "./Trade";
import { uuid } from 'uuidv4';

export default class TradeResult {
    id: string
    date: string
    trade: Trade
    isTradeValid: boolean
    tradeFailedReason: string
    constructor(trade: Trade, isTradeValid: boolean, tradeFailedReason: string) {
        this.trade = this._removeExtraDateFromTrade(trade)
        this.isTradeValid = isTradeValid
        this.tradeFailedReason = tradeFailedReason
        this.date = Date.now().toString()
        this.id = this._generateId(trade)
    }

    _generateId(trade: Trade): string {
        return uuid()
    }

    _removeExtraDateFromTrade(trade: Trade): Trade {
        trade.teams.forEach(team => {
            team.players = []
        })
        return trade
    }
}