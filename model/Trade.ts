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
    failedLocation: string
    constructor(playersInTrade: PlayerInTrade[], teams: Team[]) {
        this.playersInTrade = playersInTrade
        this.teams = teams
        this.failedReasonMessage = ''
        this.failedLocation = ''
    }

    oneHundredThousand = 100000
    fiveMillion = 5000000

    asMillions = (salary: number) => {
        return `$${(salary / 1000000).toFixed(1)}M`;
      };

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

        console.log(team.teamName)
        outgoingPlayers.forEach(player => console.log(`outgoing player: ${player.player.playerName} outgoing salary: ${player.player.outgoingSalary}`))
        console.log(`outgoing salary: ${outgoingSalary}`)
        let isTaxApronValid = this._isTaxApronValid(incomingSalary, outgoingSalary, team)
        if (!isTaxApronValid) {
            console.log("tax apron not valid")
            this.failedReasonMessage = `For trade to work ${team.teamName} must remove ${this.asMillions((incomingSalary - outgoingSalary - team.taxApron))} from their incoming salary.`
            this.failedLocation = 'tax apron'
            return false
        }

        let isCapSpaceValid = this._isCapSpaceValid(outgoingSalary, incomingSalary, team, incomingPlayers)

        // If cap space is not valid, check if tax space is valid
        if (!isCapSpaceValid) {
            console.log(`running tax space validation for ${team.teamName}`)
            let isTaxSpaceValid = this._isTaxSpaceValid(incomingSalary, outgoingSalary, team)
            console.log(`isTaxSpaceValid: ${isTaxSpaceValid}`)
            console.log(`incomingSalary: ${incomingSalary} outgoingSalary: ${outgoingSalary} team.taxSpace: ${team.taxSpace}`)
            // If tax space is not valid for any team, the whole trade is invalid
            if (!isTaxSpaceValid) {
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
            this.failedReasonMessage = `For trade to work ${team.teamName} must remove ${this.asMillions((incomingSalary - outgoingSalary - team.capSpace))} from their incoming salary.`
            this.failedLocation = 'cap space less than 0'
            return false
        }

        if (incomingSalary - outgoingSalary > team.capSpace) {
            this.failedReasonMessage = `For trade to work ${team.teamName} must remove ${this.asMillions((incomingSalary - outgoingSalary - team.capSpace))} from their incoming salary.`
            this.failedLocation = 'cap space less than incoming salary - outgoing salary'
            return this._isCapSpaceExceptionValid(outgoingSalary + team.capSpace, outgoingSalary, incomingPlayers, team)
        }
        return true
    }

    _isTaxSpaceValid(incomingSalary: number, outgoingSalary: number, team: Team) {
        let afterTradeTaxSpace = incomingSalary - outgoingSalary - team.taxSpace
        console.log(`teamName ${team.teamName} incomingSalary: ${incomingSalary} outgoingSalary: ${outgoingSalary} team.taxSpace: ${team.taxSpace} afterTradeTaxSpace: ${afterTradeTaxSpace}`)

        // If the pre trade tax space is negative, the trade max incoming salary is 125% of outgoing salary plus 100k
        // If the outgoingSalary is over $19,600,000, the trade max incoming salary is 125% of outgoing salary plus 100k
        if (afterTradeTaxSpace > 0 || outgoingSalary > 19600000) {
            console.log(`tax space is positive or outgoing salary is over 19.6 million`)
            let isTaxSpaceValid = incomingSalary <= (outgoingSalary * 1.25) + this.oneHundredThousand
            if (!isTaxSpaceValid) {
                this.failedLocation = 'tax space with outgoing salary over 19.6 million'
                this.failedReasonMessage = `For trade to work ${team.teamName} must remove ${this.asMillions((incomingSalary - ((outgoingSalary * 1.25) + this.oneHundredThousand)))} from their incoming salary.`
            }
            return isTaxSpaceValid
        }

        // Handle when outgoing salary is between $0 and $6,533,333 and the pre trade tax space is positive
        if (outgoingSalary >= 0 && outgoingSalary <= 6533333) {
            // If 175% of the outgoingSalary plus 100k causes the taxspace to be negative. 
            // The max incoming salary is the greater of 125% of the outgoing salary plus 100k and the outgoing salary plus the tax space 
            if ((outgoingSalary * 1.75) + this.oneHundredThousand - afterTradeTaxSpace < 0) {
                let maxIncomingSalary = Math.max(outgoingSalary + afterTradeTaxSpace, (outgoingSalary * 1.25) + this.oneHundredThousand)
                let isTaxSpaceValid = incomingSalary <= maxIncomingSalary
                if (!isTaxSpaceValid) {
                    this.failedLocation = 'tax space with outgoing salary between 0 and 6.5333333 and tax space negative'
                    this.failedReasonMessage = `For trade to work ${team.teamName} must remove ${this.asMillions((incomingSalary - maxIncomingSalary))} from their incoming salary.`
                }
                return isTaxSpaceValid
            }
            let isTaxSpaceValid = incomingSalary <= (outgoingSalary * 1.75) + this.oneHundredThousand
            if (!isTaxSpaceValid) {
                this.failedLocation = 'tax space with outgoing salary between 0 and 6.5333333'
                this.failedReasonMessage = `For trade to work ${team.teamName} must remove ${this.asMillions((incomingSalary - ((outgoingSalary * 1.75) + this.oneHundredThousand)))} from their incoming salary.`
            }
            return isTaxSpaceValid
        }

        // Handle when outgoing salary is between $6,533,333 and $19,600,000 andd the pre trade tax space is positive
        if (outgoingSalary > 6533333 && outgoingSalary <= 19600000) {
            // If the outgoingSalary plus 5M causes the taxspace to be negative.
            // The max incoming salary is the greater of 125% of the outgoing salary plus 100k and the outgoing salary plus the tax space
            if (outgoingSalary + this.fiveMillion - afterTradeTaxSpace < 0) {
                let maxIncomingSalary = Math.max(outgoingSalary + afterTradeTaxSpace, (outgoingSalary * 1.25) + this.oneHundredThousand)
                let isTaxSpaceValid = incomingSalary <= maxIncomingSalary
                if (!isTaxSpaceValid) {
                    this.failedLocation = 'tax space with outgoing salary between 6.5333333 and 19.6 million and tax space negative'
                    this.failedReasonMessage = `For trade to work ${team.teamName} must remove ${this.asMillions((incomingSalary - maxIncomingSalary))} from their incoming salary.`
                }
                return isTaxSpaceValid
            }
            let isTaxSpaceValid = incomingSalary <= outgoingSalary + this.fiveMillion
            if (!isTaxSpaceValid) {
                this.failedLocation = 'tax space with outgoing salary between 6.5333333 and 19.6 million'
                this.failedReasonMessage = `For trade to work ${team.teamName} must remove ${this.asMillions((incomingSalary - (outgoingSalary + this.fiveMillion)))} from their incoming salary.`
            }
            return isTaxSpaceValid
        }

        // The function should never get here
        throw new Error(`[Error] Something went wrong when validating tax space for ${team.teamName} with outgoing salary ${outgoingSalary} and incoming salary ${incomingSalary}`)
    }

    _isTaxApronValid(incomingSalary: number, outgoingSalary: number, team: Team) {
        console.log(`[Info] Validating tax apron for ${team.teamName} with outgoing salary ${outgoingSalary} and incoming salary ${incomingSalary} hard cap ${team.hardCap} tax apron ${team.taxApron}`)
        console.log(`[Info] ${incomingSalary - outgoingSalary} > ${team.taxApron} && ${team.hardCap}`)
        console.log((incomingSalary - outgoingSalary) > team.taxApron)
        if ((incomingSalary - outgoingSalary) > team.taxApron && team.hardCap) {
            return false
        }
        return true
    }

    _isCapSpaceExceptionValid(capSpace: number, outgoingSalary: number, incomingPlayers: PlayerInTrade[], team: Team) {
        console.log(`[Info] Validating cap space exception for ${team.teamName} with cap space ${capSpace} and incoming players ${incomingPlayers.map(player => player.player.playerName)}`)
        
        // Get max salary combination that fits into cap space
        let playersThatFitInCapSpace = this._getPlayersThatFitIntoCapSpace(capSpace, incomingPlayers)
        console.log(`[Info] Players that fit into cap space ${playersThatFitInCapSpace?.map(player => player.player.playerName)}`)

        // Get players that dont fit into cap space and validate if the comply via tax space
        let playersThatDontFitInCapSpace = incomingPlayers.filter(player => !playersThatFitInCapSpace?.includes(player))
        console.log(`[Info] Players that dont fit into cap space ${playersThatDontFitInCapSpace.map(player => player.player.playerName)}`)

        // Get incoming salary for players that dont fit into cap space
        let incomingSalary = playersThatDontFitInCapSpace.reduce((total, player) => total + player.player.incomingSalary, 0)

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