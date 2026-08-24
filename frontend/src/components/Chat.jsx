import { Link, useNavigate } from 'react-router-dom'
import styles from '../styles/Chat.module.css'
import { useEffect, useRef, useState } from 'react'

export default function Chat({ selectedUser, token, showButton, chatType, matchId }) {
    const intervalRef = useRef(null)
    const navigate = useNavigate()
    const [chat, setChat] = useState([])
    const [sendInputValue, setSendInputValue] = useState('')
    async function loadMessages() {
        if (chatType === 'Global') {
            const response = await fetch(`/api/messages/${selectedUser?.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()

            setChat(data)
        } else if (chatType === 'Match') {
            const response = await fetch(`/api/match/${matchId}/chat`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )

            const data = await response.json()
            console.log(data)
            if (data.isMatchOver === true) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            } else {
                setChat(data?.chat ?? [])
            }
        }

    }


    async function sendMessage() {
        if (sendInputValue === '') return
        if (chatType === 'Global') {
            const response = await fetch(`/api/sendmessage/${selectedUser.id}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        text: sendInputValue
                    })
                }
            )
            const data = await response.json();

            console.log(data);
            setSendInputValue('')
            loadMessages()
        } else if (chatType === 'Match') {
            const response = await fetch(`/api/match/${matchId}/sendmessage`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        text: sendInputValue
                    })
                }
            )
            const data = await response.json();

            console.log(data);
            setSendInputValue('')
            loadMessages()
        }
    }
    useEffect(() => {
        if (!selectedUser) return

        intervalRef.current = setInterval(() => {
            loadMessages()
        }, 1000);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, [selectedUser])

    async function CheckOrCreateMatch() {
        const res = await fetch('/api/checkPlayerMatches', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                selectedUserId: selectedUser.id
            })
        })
        const data = await res.json()
        navigate(`/match/${data.match.id}`)
    }

    if (!selectedUser) {
        return <div>Loading...</div>;
    }
    return (
        <div className={styles.chatPage}>
            <div className={styles.selectedUserInfo}><img src="/img/avatar.png" className={styles.selectedUserAvatar} />{selectedUser.username}</div>
            <div className={styles.messages}>
                {chat.map(message => {
                    return (<div className={message.receiverId === selectedUser.id ? styles.senderTypeMessage : styles.receiverTypeMessage} key={message.id}>{message.text}</div>)
                })}</div>
            <div className={styles.sendDiv}>
                <textarea type="text" className={styles.sendInput} placeholder='Send message...'
                    value={sendInputValue}
                    onChange={(e) => {
                        setSendInputValue(e.target.value)
                        e.target.style.height = '18px';
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                        }
                    }} />
                <button style={{ display: !showButton ? "none" : "block" }} onClick={() => CheckOrCreateMatch()} className={styles.playButton} title='If game with this player already started you would join it after clicking button'>Play</button>
                <img src="/img/sendMessageButton.png" className={styles.sendButton} onClick={sendMessage} />
            </div>
        </div>
    )
}
