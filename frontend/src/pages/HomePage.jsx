import { useEffect, useState } from 'react'
import UsersList from '../components/UsersList'
import styles from '../styles/HomePage.module.css'
import Chat from '../components/Chat'

export default function HomePage() {
    const token = localStorage.getItem('token')
    const [currentUser, setCurrentUser] = useState(null)
    const [playersList, setPlayersList] = useState([])
    const [selectedUser, setSelectedUser] = useState('')
    const [searchingBarValue, setSearchingBarValue] = useState('')

    useEffect(() => {
        async function load() {
            try {
                const response = await fetch('/api/usersforchat',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })

                const data = await response.json()
                setCurrentUser(data.currentUser)
                setPlayersList(data.users)
                setSelectedUser(data.users[0])
            } catch (err) {
                console.error(err)
            }
        }


        load()

    }, [token])

    return (
        <div className={styles.pageBackground}>
            <div className={styles.pageContainer}>
                <div className={styles.playersList}>
                    <h2 className={styles.playersListTitle}>All players</h2>
                    <div className={styles.searchingBar}>
                        <img className={styles.searchingBarIcon} src="/img/searchingBar.png" />
                        <input type="text" className={styles.searchingBarInput}
                            value={searchingBarValue}
                            placeholder='Type user name'
                            onChange={(e) => setSearchingBarValue(e.target.value)} />
                    </div>
                    <UsersList playersList={playersList} currentUserId={currentUser?.id} setSelectedUser={setSelectedUser} searchingBarValue={searchingBarValue} />
                    <div className={styles.mainUserProfile}><img src="./img/avatar.png" className={styles.mainUserAvatar} />{currentUser?.username}</div>
                </div>
                <div className={styles.playerChat}>
                    <Chat selectedUser={selectedUser} token={token} showButton={true} chatType={'Global'} />
                </div>
            </div>
        </div>
    )
}
