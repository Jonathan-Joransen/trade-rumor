import Player from "./Player";
import PlayerType from "./playerTypes";

export default class ExceptionAsPlayer extends Player {
    constructor(teamName: string, exceptionTitle: string, ammount: number){
        super(exceptionTitle, "", teamName, ammount, ammount, undefined, PlayerType.ExceptionAsPlayer)
    }
}

export const ConvertTradeExceptionsToPlayers = (tradeExceptions: number[], teamName: string): ExceptionAsPlayer[] => {
    return tradeExceptions.map((tradeException) => {
        return new ExceptionAsPlayer(teamName, "Trade Exception", tradeException)
    })
}

export const ConvertDisabledPlayerExceptionsToPlayers = (tradeExceptions: number[], teamName: string): ExceptionAsPlayer[] => {
    return tradeExceptions.map((tradeException) => {
        return new ExceptionAsPlayer(teamName, "DP Exception", tradeException)
    })
}