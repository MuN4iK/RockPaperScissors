import { Link, useNavigate } from 'react-router-dom'
import styles from '../styles/SingupPage.module.css'
import { useState } from 'react'

export default function SingupPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [correctPassword, setCorrectPassword] = useState(true)

    async function singup() {
        setCorrectPassword(true)
        if (password === repeatPassword) {
            setCorrectPassword(true)
            const response = await fetch('/api/singup', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            })

            const data = await response.json()
            console.log(data)

            if (response.ok) {
                localStorage.setItem('token', data.token)
                navigate('/', { replace: true })

            }
        } else {
            setCorrectPassword(false)
        }

    }

    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Sing up page</h1>
                <div className={styles.singupDiv}>
                    <img src="/img/avatar.png" className={styles.singupImg} /><input className={styles.singupInp}
                        type="text"
                        placeholder='Username'
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className={styles.singupDiv}>
                    <img src="/img/password.png" className={styles.singupImg} /> <input className={styles.singupInp}
                        type="password"
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}

                    />
                </div>
                <div className={styles.singupDiv}>
                    <img src="/img/password.png" className={styles.singupImg} /> <input className={styles.singupInp}
                        type="password"
                        placeholder='Repeat password'
                        onChange={(e) => setRepeatPassword(e.target.value)}

                    />
                </div>
                <p style={{ display: !correctPassword ? 'block' : 'none' }} className={styles.errorText}>Passwords do not match!</p>
                <button className={styles.singupButton} onClick={() => singup()} >Create account</button>
                <h4 className={styles.bottomText}>Already have account?<Link className={styles.singupLink} to='/login'>Log in!</Link></h4>
            </div>
        </div>
    )
}
