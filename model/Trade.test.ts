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
        new Team("Heat", "Miami", 185171, 300722202, "East", false),
        new Team("Pistons", "Detroit", 27317721, 68627400, "East", false)
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

describe("Trade fails", () => {
    let teams: Team[] = [
        new Team("Grizzlies", "Memphis", 28893640, 705335, "East", true),
        new Team("Timberwolves", "Minnisota", 3059175, -55085691, "East", true)
    ]
    
    let playersInTrade: PlayerInTrade[] = [
        new PlayerInTrade(
            new RosterPlayer("J", "Jackson Jr", "Grizzlies", 28946605, 28946605),
            "Timberwolves"),
        new PlayerInTrade(
            new RosterPlayer("C", "Gobert", "Timberwolves", 38172414, 38172414),
            "Grizzlies")
        ]
    it("Trade should fail", () => {
        let trade = new Trade(playersInTrade, teams);
        let isValid = trade.isValidTrade();
        console.log("failure: " + trade.failedReasonMessage)
        console.log("failure: " + trade.failedLocation)
       expect(isValid).toBe(false);
    });
});

describe("Trade failed reason is correct", () => {
    let teams: Team[] = [
        new Team("Nuggets", "Denver", -10539228, -48377689, "West", false),
        new Team("Warriors", "Golden State", -39227053, -78436306, "West", false)
    ]
    
    let playersInTrade: PlayerInTrade[] = [
        new PlayerInTrade(
            new RosterPlayer("J", "Poole", "Warriors", 25378280, 3901399),
            "Nuggets"),
        new PlayerInTrade(
            new RosterPlayer("K", "Looney", "Warriors", 7000000, 7000000),
            "Nuggets"),
        new PlayerInTrade(
            new RosterPlayer("K", "Caldwell-Pope", "Nuggets", 14004703, 14004703),
            "Warriors"),
        new PlayerInTrade(
            new RosterPlayer("M", "Porter Jr.", "Nuggets", 30913750, 30913750),
            "Warriors"),
        new PlayerInTrade(
            new RosterPlayer("N", "Hyland", "Nuggets", 2201520, 2201520),
            "Warriors"),
        ]
    it("Failed Reason is correct", () => {
        let trade = new Trade(playersInTrade, teams);
        let isValid = trade.isValidTrade();
        console.log(trade.failedReasonMessage)
       expect(trade.failedReasonMessage).toBe("For trade to work Warriors must remove $33.4M from their incoming salary.");
    });
});