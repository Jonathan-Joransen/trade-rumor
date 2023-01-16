import { DraftPlayer } from "./DraftPlayer"
import { PlayerInTrade } from "./PlayerInTrade"
import PlayerAndSalaryCombination from "./PlayerSalaryCombinations"
import PlayerType from "./playerTypes"
import { RosterPlayer } from "./RosterPlayer"
import Team from "./Team"

export class Trade {
    playersInTrade: PlayerInTrade[]
    teams: Team[]
    failedReasonMessage: string
    constructor(playersInTrade: PlayerInTrade[], teams: Team[]) {
        this.playersInTrade = playersInTrade
        this.teams = teams
        this.failedReasonMessage = ''
    }

    oneHundredThousand = 100000
    fiveMillion = 5000000

    isValidTrade() {
        if (this.playersInTrade.length < 2) {
            this.failedReasonMessage = 'A trade must have at least 2 players'
            return false
        }

        if (this.teams.length > 4 || this.teams.length < 2) {
            this.failedReasonMessage = 'A trade must have between 2 and 4 teams'
            return false
        }

        let arePlayersValid = this._arePlayersValid(this.playersInTrade)
        let areTeamsValid = this._areTeamsValid(this.teams, this.playersInTrade)

        return arePlayersValid && areTeamsValid
    }

    _arePlayersValid(playersInTrade: PlayerInTrade[]) {
        for (let playerInTrade of playersInTrade) {
            // Draft picks have no trade restrictions at this time
            if (playerInTrade.player.playerType === PlayerType.DraftPlayer) {
                continue
            }
            // Upcoming free agents cannot be traded
            if (playerInTrade.player.playerType === PlayerType.RosterPlayer 
                && (playerInTrade.player as RosterPlayer).isUpcomingFreeAgent) {
                this.failedReasonMessage = `${playerInTrade.player.playerName} is an upcoming free agent. Upcoming free agents cannot be traded`
                return false
            }
            // Ensure players aren't traded to teams they cannot be traded to
            if (playerInTrade.player.playerType === PlayerType.RosterPlayer && 
                (playerInTrade.player as RosterPlayer).teamsCannotBeTradedTo.map(team => team.toLowerCase()).includes(playerInTrade.toTeamName.toLowerCase())) {
                this.failedReasonMessage = `${playerInTrade.player.playerName} cannot be traded to ${playerInTrade.toTeamName}`
                return false
            }
        }
        return true
    }

    _areTeamsValid(teams: Team[], players: PlayerInTrade[]) {
        for (let team of teams) {
            let isTeamValid = this._isTeamValid(team, players)
            if (!isTeamValid) {
                return false
            }
        }
        // If all teams have valid cap space or tax space, the trade is valid
        return true
    }

    _isTeamValid(team: Team, players: PlayerInTrade[]) {
        let outgoingPlayers = players.filter(player => player.fromTeamName.toLowerCase() === team.teamName.toLowerCase())
        let incomingPlayers = players.filter(player => player.toTeamName.toLowerCase() === team.teamName.toLowerCase())
        let outgoingSalary = outgoingPlayers.reduce((total, player) => total + player.player.outgoingSalary, 0)
        let incomingSalary = incomingPlayers.reduce((total, player) => total + player.player.incomingSalary, 0)

        let isTaxApronValid = this._isTaxApronValid(incomingSalary, outgoingSalary, team)
        if (!isTaxApronValid) {
            this.failedReasonMessage = `For trade to work ${team.teamName} must remove $${(incomingSalary - outgoingSalary - team.taxApron)} from their incoming salary.`
            return false
        }

        let isCapSpaceValid = this._isCapSpaceValid(outgoingSalary, incomingSalary, team, incomingPlayers)

        // If cap space is not valid, check if tax space is valid
        if (!isCapSpaceValid) {
            let isTaxSpaceValid = this._isTaxSpaceValid(incomingSalary, outgoingSalary, team)
            // If tax space is not valid for any team, the whole trade is invalid
            if (!isTaxSpaceValid) {
                this.failedReasonMessage = `For trade to work ${team.teamName} must remove $${(incomingSalary - outgoingSalary - team.taxSpace)} from their incoming salary.`
                return this._isTeamValidWithTradeExceptions(team, incomingPlayers)
            }
        }
        return true
    }

    _isTeamValidWithTradeExceptions(team: Team, incomingPlayers: PlayerInTrade[]): boolean {
        // If there are no trade exceptions, the trade is invalid
        if (team.tradeExceptions.length < 0) {
            return false
        }

        // If there are trade exceptions, find the player with the largest salary that fits in a trade exception
        let playerWithLargestSalaryThatFitsInATradeException = this._playerWithLargestSalaryThatFitsInATradeException(incomingPlayers, team.tradeExceptions.map(tradeException => tradeException.ammount))

        // If there is no player with a salary that fits in a trade exception, the trade is invalid
        if (playerWithLargestSalaryThatFitsInATradeException === null) {
            return false
        }

        // If there is a player with a salary that fits in a trade exception, remove that player from the incoming players and re-check if the team is valid
        let incomingPlayersWithoutTradeExceptionPlayer = incomingPlayers.filter(player => player.player !== playerWithLargestSalaryThatFitsInATradeException?.player)
        return this._isTeamValid(team, incomingPlayersWithoutTradeExceptionPlayer)        
    }

    _playerWithLargestSalaryThatFitsInATradeException(incomingPlayers: PlayerInTrade[], tradeExceptions: number[]): PlayerInTrade | null {
        let smallestMargin = Number.MAX_SAFE_INTEGER
        let playerWithLargestSalaryThatFitsInATradeException = null
        for (let player of incomingPlayers) {
            for (let tradeException of tradeExceptions) {
                let margin = tradeException - player.player.incomingSalary
                if (margin >= 0 && margin < smallestMargin) {
                    smallestMargin = margin
                    playerWithLargestSalaryThatFitsInATradeException = player
                }
            }
        }
        return playerWithLargestSalaryThatFitsInATradeException
    }

    _isCapSpaceValid(outgoingSalary: number, incomingSalary: number, team: Team, incomingPlayers: PlayerInTrade[]) {
        if (team.capSpace < 0) {
            this.failedReasonMessage = `For trade to work ${team.teamName} must remove $${(incomingSalary - outgoingSalary - team.capSpace)} from their incoming salary.`
            return false
        }

        if (incomingSalary - outgoingSalary > team.capSpace) {
            this.failedReasonMessage = `For trade to work ${team.teamName} must remove $${(incomingSalary - outgoingSalary - team.capSpace)} from their incoming salary.`
            return this._isCapSpaceExceptionValid(outgoingSalary + team.capSpace, incomingPlayers, team)
        }
        return true
    }

    _isTaxSpaceValid(incomingSalary: number, outgoingSalary: number, team: Team) {
        let afterTradeTaxSpace = incomingSalary - outgoingSalary - team.taxSpace

        // If the pre trade tax space is negative, the trade max incoming salary is 125% of outgoing salary plus 100k
        // If the outgoingSalary is over $19,600,000, the trade max incoming salary is 125% of outgoing salary plus 100k
        if (afterTradeTaxSpace < 0 || outgoingSalary > 19600000) {
            return incomingSalary <= (outgoingSalary * 1.25) + this.oneHundredThousand
        }

        // Handle when outgoing salary is between $0 and $6,533,333 and the pre trade tax space is positive
        if (outgoingSalary >= 0 && outgoingSalary <= 6533333) {
            // If 175% of the outgoingSalary plus 100k causes the taxspace to be negative. 
            // The max incoming salary is the greater of 125% of the outgoing salary plus 100k and the outgoing salary plus the tax space 
            if ((outgoingSalary * 1.75) + this.oneHundredThousand - afterTradeTaxSpace < 0) {
                let maxIncomingSalary = Math.max(outgoingSalary + afterTradeTaxSpace, (outgoingSalary * 1.25) + this.oneHundredThousand)
                return incomingSalary <= maxIncomingSalary
            }
            return incomingSalary <= (outgoingSalary * 1.75) + this.oneHundredThousand
        }

        // Handle when outgoing salary is between $6,533,333 and $19,600,000 andd the pre trade tax space is positive
        if (outgoingSalary > 6533333 && outgoingSalary <= 19600000) {
            // If the outgoingSalary plus 5M causes the taxspace to be negative.
            // The max incoming salary is the greater of 125% of the outgoing salary plus 100k and the outgoing salary plus the tax space
            if (outgoingSalary + this.fiveMillion - afterTradeTaxSpace < 0) {
                let maxIncomingSalary = Math.max(outgoingSalary + afterTradeTaxSpace, (outgoingSalary * 1.25) + this.oneHundredThousand)
                return incomingSalary <= maxIncomingSalary
            }
            return incomingSalary <= outgoingSalary + this.fiveMillion
        }

        // The function should never get here
        throw new Error(`[Error] Something went wrong when validating tax space for ${team.teamName} with outgoing salary ${outgoingSalary} and incoming salary ${incomingSalary}`)
    }

    _isTaxApronValid(incomingSalary: number, outgoingSalary: number, team: Team) {
        if (incomingSalary - outgoingSalary > team.taxApron && team.hardCap) {
            return false
        }
        return true
    }

    _isCapSpaceExceptionValid(capSpace: number, incomingPlayers: PlayerInTrade[], team: Team) {
        // Get max salary combination that fits into cap space
        let playersThatFitInCapSpace = this._getPlayersThatFitIntoCapSpace(capSpace, incomingPlayers)

        // Get players that dont fit into cap space and validate if the comply via tax space
        let playersThatDontFitInCapSpace = incomingPlayers.filter(player => !playersThatFitInCapSpace?.includes(player))

        // Get incoming and outgoing salary for players that dont fit into cap space
        let incomingSalary = playersThatDontFitInCapSpace.reduce((total, player) => total + player.player.incomingSalary, 0)
        let outgoingSalary = playersThatDontFitInCapSpace.reduce((total, player) => total + player.player.outgoingSalary, 0)

        // Validate if the players that dont fit into cap space comply via tax space
        return this._isTaxSpaceValid(incomingSalary, outgoingSalary, team)
    }

    _getPlayersThatFitIntoCapSpace(capSpace: number, incomingPlayers: PlayerInTrade[]): PlayerInTrade[] | null {
        let start = incomingPlayers.length
        let allSalaryCombinations = []
        let playerSalaryCombinations = incomingPlayers.map(pInTrade => new PlayerAndSalaryCombination(pInTrade.player.incomingSalary, [pInTrade]))

        for (let i = 0; i < start; i++) {
            playerSalaryCombinations = this._findPlayerSalaryCombintions(playerSalaryCombinations, capSpace, i)
            allSalaryCombinations.push(...playerSalaryCombinations)
        }

        const maxSalaryCombination = Math.max(...allSalaryCombinations.map(x => x.salaryCombination));
        const playersInMaxCombination = allSalaryCombinations.find(x => x.salaryCombination === maxSalaryCombination);

        return playersInMaxCombination?.players ?? null
    }

    _findPlayerSalaryCombintions = (playerList: PlayerAndSalaryCombination[], capSpace: number, timesExecuted: number): PlayerAndSalaryCombination[] => {
        let allPlayers = []
        for (let i = 0; i < playerList.length; i++) {
            const playerOneSalary = playerList[i].salaryCombination;
            if (timesExecuted === 0 && playerOneSalary <= capSpace) {
                allPlayers.push({ salaryCombination: playerOneSalary, players: [...playerList[i].players] })
            }
            for (let j = i + 1; j < playerList.length; j++) {
                const playerTwoSalary = playerList[j].salaryCombination
                if (playerOneSalary + playerTwoSalary <= capSpace) {
                    allPlayers.push(new PlayerAndSalaryCombination(playerOneSalary + playerTwoSalary, [...playerList[j].players, ...playerList[i].players]))
                }
            }
        }
        return allPlayers
    }
}

export default Trade