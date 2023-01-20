import Trade from "./Trade";

export default class TradeResult {
    id: string
    trade: Trade
    isTradeValid: boolean
    tradeFailedReason: string
    constructor(trade: Trade, isTradeValid: boolean, tradeFailedReason: string) {
        this.trade = trade
        this.isTradeValid = isTradeValid
        this.tradeFailedReason = tradeFailedReason
        this.id = this._generateId(trade)
    }

    _generateId(trade: Trade): string {
        let id = ''
        trade.teams.sort((team1, team2) => team1.teamName[0].localeCompare(team2.teamName[0])).forEach(t => {
            id += t.teamName
        })
        trade.playersInTrade.sort((player1, player2) => player1.player.playerName[0].localeCompare(player2.player.playerName[0])).forEach(p => {
            id += p.player.playerName
        })
        let date = new Date()
        id += `${date.getMonth()}${date.getDay()}${date.getFullYear()}`
        return encodeURIComponent(id)
    }
}