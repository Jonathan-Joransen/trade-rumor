import fs from 'fs';
import Player from '../model/Player';
import Team from '../model/Team';
import TradeResult from '../model/TradeResult';

export default class DatabaseClient {

    UpdateTeam(team: Team): void {
        let teams: any[] = []
        fs.readFile(`${process.env.DATA_PATH}/teams.json`, 'utf8', function (err,data) {
            try {
                teams = JSON.parse(data)
                let index = teams.findIndex(t => t.teamName.toLowerCase() === team.teamName.toLowerCase())
                if(index === -1) {
                    return // team doesn't exist
                }
                teams[index] = team
                fs.writeFile(`${process.env.DATA_PATH}/teams.json`, JSON.stringify(teams), function (err) {
                    if (err) return console.log(err);
                });
            } catch (error) {
                console.log(error)
            }
        });
    }

    AddTeam(team: Team): void {
        let teams: any[] = []
        fs.readFile(`${process.env.DATA_PATH}/teams.json`, 'utf8', function (err,data) {
            try {
                console.log(data)
                teams = JSON.parse(data)
                if(teams.find(t => t.teamName.toLowerCase() === team.teamName.toLowerCase())) {
                    return // team already exists
                }
                teams.push(team)
                fs.writeFile(`${process.env.DATA_PATH}/teams.json`, JSON.stringify(teams), function (err) {
                    if (err) return console.log(err);
                });
            } catch (error) {
                console.log(error)
                teams.push(team)
                fs.writeFile(`${process.env.DATA_PATH}/teams.json`, JSON.stringify(teams), function (err) {
                    if (err) return console.log(err);
                });
            }
        });
    }

    async GetTeams(): Promise<Team[]> {
        let data = await fs.readFileSync(`${process.env.DATA_PATH}/teams.json`,  'utf8');
        return JSON.parse(data)
    }

    async GetTeam(teamName: string): Promise<Team> {
        let teams = await this.GetTeams()
        return teams.find(t => t.teamName.toLowerCase() === teamName.toLowerCase()) as Team
    }

    AddPlayer(player: Player): void {
        let players: any[] = []
        fs.readFile(`${process.env.DATA_PATH}/players.json`, 'utf8', function (err,data) {
            try {
                console.log(data)
                players = JSON.parse(data)
                players.push(player)
                fs.writeFile(`${process.env.DATA_PATH}/players.json`, JSON.stringify(players), function (err) {
                    if (err) return console.log(err);
                });
            } catch (error) {
                console.log(error)
                players.push(player)
                fs.writeFile(`${process.env.DATA_PATH}/players.json`, JSON.stringify(players), function (err) {
                    if (err) return console.log(err);
                });
            }
        });
    }

    async GetPlayers(): Promise<Player[]> {
        let data = await fs.readFileSync(`${process.env.DATA_PATH}/players.json`,  'utf8');
        return JSON.parse(data)
    }

    async AddTrade(trade: TradeResult): Promise<void> {
        // check if trade already exists
        let doesTradeExist = await this.GetTrade(trade.id) !== undefined
        if(doesTradeExist) {
            return // trade already exists
        }

        let trades: any[] = []
        fs.readFile(`${process.env.DATA_PATH}/trades.json`, 'utf8', function (err,data) {
            try {
                console.log(data)
                trades = JSON.parse(data)
                trades.push(trade)
                fs.writeFile(`${process.env.DATA_PATH}/trades.json`, JSON.stringify(trades), function (err) {
                    if (err) return console.log(err);
                });
            } catch (error) {
                console.log(error)
                trades.push(trade)
                fs.writeFile(`${process.env.DATA_PATH}/trades.json`, JSON.stringify(trades), function (err) {
                    if (err) return console.log(err);
                });
            }
        });
    }

    async GetTrade(id: string): Promise<TradeResult | undefined> {
        try{
            let data = await fs.readFileSync(`${process.env.DATA_PATH}/trades.json`,  'utf8');
            let trades = JSON.parse(data)
            let trade = trades.find((t: TradeResult) => t.id === id)

            if (trade) {
                return trade as TradeResult
            }

            return undefined
        }
        catch(error) {
            console.log(error)
            return undefined
        }
    }
}