import { useState } from "react"
import styles from '../styles/LoginPage.module.css'
import { useNavigate, Link } from "react-router-dom"
import useCheckPassword from "../hooks/useCheckPassword"

export default function LoginPage() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [correctPassword, setCorrectPassword] = useState(true)



    async function login() {
        if (useCheckPassword(password)) {
            setCorrectPassword(true)
            const response = await fetch('/api/login', {
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
            } else {
                setCorrectPassword(false)
            }
        } else {
            setCorrectPassword(false)
        }
    }

    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Login page</h1>
                <div className={styles.loginDiv}>
                    <img src="/img/avatar.png" className={styles.loginImg} /><input className={styles.loginInp}
                        type="text"
                        placeholder='Username'
                        onChange={(e) => { setUsername(e.target.value) }} />
                </div>
                <div className={styles.loginDiv}>
                    <img src="/img/password.png" className={styles.loginImg} /> <input className={styles.loginInp}
                        type="password"
                        placeholder='Password'
                        onChange={(e) => { setPassword(e.target.value) }} />
                </div>
                <p style={{ display: !correctPassword ? 'block' : 'none' }} className={styles.errorText}>Inccorect username or password!</p>
                <button className={styles.loginButton} onClick={() => login()}>Log in</button>
                <h4>Dont have account?<Link className={styles.loginLink} to='/singup'>Sing up!</Link></h4>
            </div>
        </div>
    )

}
