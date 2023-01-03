import PlayerType from "./playerTypes"

export default class Player {
    constructor(firstName: string, lastName: string, teamName: string, incomingSalary: number, 
        outgoingSalary: number, profileImage: string | null = null, playerType: PlayerType,
        isTwoWay: boolean = false, isPoisonPill: boolean = false){
        this.playerName = firstName + lastName
        this.firstName = firstName 
        this.lastName = lastName 
        this.teamName = teamName
        this.incomingSalary = incomingSalary
        this.outgoingSalary = outgoingSalary
        this.profileImage = profileImage ?? `../images/default-players/${teamName}-default-player.png`
        this.isTwoWay = isTwoWay
        this.isPoisonPill = isPoisonPill
        this.playerType = playerType
    }
    playerType: PlayerType
    playerName: string
    firstName: string
    lastName: string
    teamName: string
    incomingSalary: number
    outgoingSalary: number
    profileImage: string
    isTwoWay: boolean
    isPoisonPill: boolean
}