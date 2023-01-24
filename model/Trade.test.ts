import Trade from "./Trade";
import { describe, expect, it } from "vitest";
import Team from "./Team";
import { PlayerInTrade } from "./PlayerInTrade";
import PlayerType from "./playerTypes";
import { RosterPlayer } from "./RosterPlayer";

let teams: Team[] = [
    new Team("Knicks", "New York", 7600247, -19011753, "East", false),
    new Team("Suns", "Pheonix", -16885588, -48683400, "East", false)
]

let playersInTrade: PlayerInTrade[] = [
    new PlayerInTrade(
        new RosterPlayer("J", "Crowder", "Suns", 10200000, 10200000),
        "Knicks"),
    new PlayerInTrade(
        new RosterPlayer("C", "Reddish", "Knicks", 27700000, 27700000),
        "Suns")
    ]

describe("Trade", () => {
    let teams: Team[] = [
        new Team("Heat", "Miami", 185171, -300722202, "East", false),
        new Team("Pistons", "Detroit", 27317721, 6627400, "East", false)
    ]
    
    let playersInTrade: PlayerInTrade[] = [
        new PlayerInTrade(
            new RosterPlayer("Jimmy", "Butler", "Heat", 37700000, 37700000),
            "Pistons"),
        new PlayerInTrade(
            new RosterPlayer("Andre", "Drummond", "Pistons", 27700000, 27700000),
            "Heat")
        ]
    it("should create a trade", () => {
        let trade = new Trade(playersInTrade, teams);
        expect(trade.isValidTrade()).toBe(true);
    });
});


describe("Trade works under 175% + $100k rule", () => {
    let teams: Team[] = [
        new Team("Knicks", "New York", 7600247, -19011753, "East", false),
        new Team("Suns", "Pheonix", -16885588, -48683400, "East", false)
    ]
    
    let playersInTrade: PlayerInTrade[] = [
        new PlayerInTrade(
            new RosterPlayer("J", "Crowder", "Suns", 10183800, 10183800),
            "Knicks"),
        new PlayerInTrade(
            new RosterPlayer("C", "Reddish", "Knicks", 5954454, 5954454),
            "Suns")
        ]
    it("Trade should work under 175% + $100k rule", () => {
        let trade = new Trade(playersInTrade, teams);
        let isValid = trade.isValidTrade();
        console.log(trade.failedReasonMessage)
       expect(isValid).toBe(true);
    });
});