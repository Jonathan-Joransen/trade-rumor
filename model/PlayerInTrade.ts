import Player from "./Player"
import Team from "./Team"

export class PlayerInTrade {
    constructor(player: Player, toTeamName: string){
        this.player = player
        this.toTeamName = toTeamName
        this.fromTeamName = player.teamName
    }
    
    player: Player
    fromTeamName: string
    toTeamName: string
}