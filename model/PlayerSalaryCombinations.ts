import { PlayerInTrade } from "./PlayerInTrade";

export default class PlayerAndSalaryCombination {
    constructor(salaryCombination: number, players: PlayerInTrade[]){
        this.salaryCombination = salaryCombination;
        this.players = players;
    }
    salaryCombination: number;
    players: PlayerInTrade[];
}