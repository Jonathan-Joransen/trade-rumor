import Player from './Player'
import TradeOrDisabledPlayerException from './TradeException'

export default class Team {
    teamName: string
    conference: string
    city: string
    taxApron: number
    taxSpace: number
    capSpace: number
    hardCap: boolean
    tradeExceptions: TradeOrDisabledPlayerException[]
    players: Player[]
    logoPath: string
    constructor(teamName: string, city: string, taxSpace: number = 0, capSpace: number = 0, conference: string,
         hardCap: boolean = false, tradeExceptions = [], players = []) {
        this.teamName = teamName
        this.city = city
        this.taxApron = taxSpace + 6000000
        this.taxSpace = taxSpace
        this.capSpace = capSpace
        this.hardCap = hardCap
        this.tradeExceptions = tradeExceptions
        this.conference = conference
        this.players = players
        this.logoPath = `../../images/team-logos/${teamName.toLowerCase()}-logo.png`
    }
}
