
export enum TradeOrDisabledPlayerExceptionTypes {
    DisabledPlayerException = "DisabledPlayerException",
    TradeException = "TradeException"
}

export default class TradeOrDisabledPlayerException {
    constructor(exceptionType: TradeOrDisabledPlayerExceptionTypes, ammount: number){
        this.exceptionType = exceptionType
        this.ammount = ammount
    }
    exceptionType: TradeOrDisabledPlayerExceptionTypes
    ammount: number
}