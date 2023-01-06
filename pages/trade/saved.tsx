import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { Header } from "../../components/header"
import TradeResult from "../../model/TradeResult"
import styles from "../../styles/SavedTrades.module.css"

export const SavedTrades = () => {
    const router = useRouter();
    const [savedTrades, setSavedTrades] = useState<TradeResult[]>([])
            
    useEffect(() => {
        const savedIds = JSON.parse(localStorage.getItem('savedTrades') ?? "[]");
        const initialSavedTrades: TradeResult[] = []
        const fetchIds = async () => {
            for (let i = 0; i < savedIds.length; i++) {
                const response = await fetch(`/api/trade?id=${savedIds[i]}`)
                const trade = await response.json()
                initialSavedTrades.push(trade)
            }
            setSavedTrades(initialSavedTrades)
        }
        fetchIds()
    }, [])

    let handleNewTrade = () => {
        router.push("/trade");
    }

    let handleDelete = (tradeId: string) => {
        let savedIds = JSON.parse(localStorage.getItem('savedTrades') ?? "[]");
        savedIds = savedIds.filter((id: string) => id !== tradeId);
        localStorage.setItem('savedTrades', JSON.stringify(savedIds));
        setSavedTrades((prevSavedTrades) => prevSavedTrades.filter((trade) => trade.id !== tradeId));
    }

    let handleView = (tradeId: string) => {
        router.push("../../trading/" + tradeId);
    }

    return (
        <div className={styles.container}>
            <Header
                buttonProps={{
                    text: "New Trade",
                    icon: "../images/swap-white.png",
                    onClick: handleNewTrade
                }}
            ></Header>
            {
                savedTrades && 
                <div className={styles.savedTradesContainer}>
                    { 
                        savedTrades && savedTrades.length > 0 && 
                        savedTrades.map((tradeResult) => {
                            return (
                                <div className={styles.savedTrade}>
                                    <div className={styles.savedItem}>
                                        Teams: 
                                        <div className={styles.savedTradeIcons}>
                                            {tradeResult.trade.teams.map(team => <img className={styles.savedTradeIcon} src={team.logoPath}/>)}
                                        </div>
                                    </div>     
                                    <div className={styles.savedItem}>
                                        Players: 
                                        <div className={styles.savedTradeIcons}>
                                            {tradeResult.trade.playersInTrade.map(player => <img className={styles.savedTradeIcon} src={player.player.profileImage}/>)}
                                        </div>
                                    </div>
                                    <div className={styles.savedButtonsContainer}>
                                        <button className={styles.savedButton} onClick={() => handleDelete(tradeResult.id)}>Delete</button>
                                        <button className={styles.savedButton} onClick={() => handleView(tradeResult.id)}>View</button>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            }
        </div>
    )
}

SavedTrades.auth = false;

export default SavedTrades