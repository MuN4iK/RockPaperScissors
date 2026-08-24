import { useEffect, useState } from "react"
import styles from '../styles/RockPaperScissorsPage.module.css'
import Chat from "../components/Chat"
import { useParams } from "react-router-dom"
import { Link } from "react-router-dom"

export default function RockPaperScissorsPage() {
    const { matchId } = useParams()
    const [selectedUser, setSelectedUser] = useState([])
    const token = localStorage.getItem('token')
    const [winner, setWinner] = useState(null)



    useEffect(() => {
        async function load() {
            const response = await fetch(`/api/match/${matchId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            const data = await response.json()
            setSelectedUser(data.opponent)
            setWinner(data.winner)
            console.log(data)
        }
        load()
    }, [matchId])

    async function makeChoice(choice) {

        const response = await fetch(`/api/match/${matchId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    choice: choice
                })
            })
        const data = await response.json()
        console.log(data)
        startChecking()
    }

    function startChecking() {


        const interval = setInterval(async () => {
            const response = await fetch(`/api/match/${matchId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            const data = await response.json()
            if (data.opponent.choice === null) {
                console.log('waiting for second player')
                return
            }
            console.log(data)
            setWinner(data.winner)
            clearInterval(interval)
        }, 1000)
    }

    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <div className={styles.selectorContainer}>
                    <h2 className={styles.selectorTitle}>Make your choice</h2>
                    <img src="/img/paper.png" className={styles.paperIcon} onClick={!winner ? () => makeChoice('paper') : () => alert('match is over')} />
                    <img src="/img/rock.png" className={styles.rockIcon} onClick={!winner ? () => makeChoice('rock') : () => alert('match is over')} />
                    <img src="/img/scissors.png" className={styles.scissorsIcon} onClick={!winner ? () => makeChoice('scissors') : () => alert('match is over')} />
                </div>
                <div className={styles.gameContainer}>
                    {!winner
                        ? <p className={styles.waitingText}>Waiting for both player to make choice<span className={styles.dots}></span></p>
                        : <div className={styles.afterMatchText}>{winner === selectedUser.username ?
                            <p className={styles.matchResultText}>You lose</p> :
                            winner === 'draw' ?
                                <p className={styles.matchResultText}>Draw</p> :
                                <p className={styles.matchResultText}> You win</p>

                        }
                            <Link to='/' className={styles.backButton}>
                                <div className={styles.backButtonContainer}>
                                    <img className={styles.backButtonImg} src='/img/backArrow.png' />
                                    <div >Back to home</div>
                                </div>
                            </Link>
                        </div>
                    }
                </div>
                <div className={styles.otherPlayerContainer}>
                    <Chat selectedUser={selectedUser} token={token} showButton={false} chatType={'Match'} matchId={matchId} />
                </div>
            </div>
        </div >
    )
}
