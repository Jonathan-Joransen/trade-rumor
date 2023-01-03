import Player from "./Player";
import PlayerType from "./playerTypes";

export default class Cash extends Player{
    constructor(teamName: string){
        super("Cash", "", teamName, 0, 0, "../images/money-bag-white.png", PlayerType.Cash)
    }
}