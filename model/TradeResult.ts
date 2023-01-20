import Trade from "./Trade";

export default class TradeResult {
    id: string
    trade: Trade
    isTradeValid: boolean
    tradeFailedReason: string
    constructor(trade: Trade, isTradeValid: boolean, tradeFailedReason: string) {
        this.trade = this._removeExtraDateFromTrade(trade)
        this.isTradeValid = isTradeValid
        this.tradeFailedReason = tradeFailedReason
        this.id = this._generateId(trade)
    }

    _generateId(trade: Trade): string {
        let id = ''
        trade.teams.sort((team1, team2) => team1.teamName[0].localeCompare(team2.teamName[0])).forEach(t => {
            id += t.teamName
        })
        
        id +=  Date.now().toString()
        return encodeURIComponent(id)
    }

    _removeExtraDateFromTrade(trade: Trade): Trade {
        trade.teams.forEach(team => {
            team.players = []
        })
        return trade
    }
}