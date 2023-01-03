import Player from "./Player"
import PlayerType from "./playerTypes"

export class RosterPlayer extends Player {
    constructor(firstName: string, lastName: string, teamName: string, 
        incomingSalary: number, outgoingSalary: number, tradeKicker: number = 0, 
        cannotTradeUntilDate: string | null = null,  cannotTradeWithOtherPlayersUntilDate: string | null = null, isTwoWay: boolean = false, isPoisonPill: boolean = false, 
        isUpcomingFreeAgent: boolean = false, hasPlayerOption: boolean = false, hasTeamOption: boolean = false, teamsCannotBeTradedTo: string[] = []){
        super(firstName, lastName, teamName, incomingSalary, outgoingSalary, undefined, PlayerType.RosterPlayer)
        this.tradeKicker = tradeKicker
        this.cannotTradeUntilDate = cannotTradeUntilDate
        this.cannotTradeWithOtherPlayersUntilDate = cannotTradeWithOtherPlayersUntilDate
        this.isTwoWay = isTwoWay
        this.isPoisonPill = isPoisonPill
        this.isUpcomingFreeAgent = isUpcomingFreeAgent
        this.hasPlayerOption = hasPlayerOption
        this.teamsCannotBeTradedTo = teamsCannotBeTradedTo
        this.hasTeamOption = hasTeamOption
    }
    tradeKicker: number
    cannotTradeUntilDate: string | null
    cannotTradeWithOtherPlayersUntilDate: string | null
    isTwoWay: boolean
    isPoisonPill: boolean
    isUpcomingFreeAgent: boolean
    hasPlayerOption: boolean
    teamsCannotBeTradedTo: string[]
    hasTeamOption: boolean
}