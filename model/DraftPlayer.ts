import Player from './Player'
import PlayerType from './playerTypes'

export class DraftPlayer extends Player {
    constructor(playerName: string, teamName: string, isDraftPick: boolean = false){
        super(playerName, "", teamName, 0, 0, null, PlayerType.DraftPlayer)  
        this.isDraftPick = isDraftPick
        this.isDraftRights = !isDraftPick
    }
    isDraftPick: boolean
    isDraftRights: boolean
}