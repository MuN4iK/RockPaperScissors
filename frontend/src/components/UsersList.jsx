import styles from '../styles/UsersList.module.css'

export default function UsersList({ playersList, currentUserId, setSelectedUser, searchingBarValue }) {
    return (
        <div className={styles.userListContainer}>
            {playersList
                .filter(user => user.id !== currentUserId)
                .filter(user =>
                    user.username.toLowerCase().includes((searchingBarValue).toLowerCase())
                )
                .map(player => {
                    return (
                        <div key={player.id} className={styles.userProfileContainer} onClick={() => setSelectedUser(player)}>
                            <img src="./img/avatar.png" className={styles.avatar} />
                            {player.username}
                        </div>
                    )
                })}
        </div>
    )
}
