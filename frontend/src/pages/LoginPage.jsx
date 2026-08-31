import { useRef, useState } from "react"
import styles from '../styles/LoginPage.module.css'
import { useNavigate, Link } from "react-router-dom"

export default function LoginPage() {
    const inputs = useRef([])
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [correctPassword, setCorrectPassword] = useState(true)
    const [showPassword, setShowPassword] = useState(false)



    function handleKeyDown(e, nextIndexNuber) {
        if (e.key === 'Enter') {
            e.preventDefault()
            inputs.current[nextIndexNuber]?.focus()
        }
    }

    async function login() {
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
    }

    return (
        <div className={styles.pageBackground}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>Login page</h1>
                <div className={styles.loginDiv}>
                    <img src="/img/avatar.png" className={styles.loginImg} /><input className={styles.loginInp}
                        type="text"
                        placeholder='Username'
                        onChange={(e) => { setUsername(e.target.value) }}
                        ref={el => inputs.current[0] = el}
                        onKeyDown={e => (handleKeyDown(e, 1), console.log(inputs))} />
                </div>
                <div className={styles.loginDiv}>
                    <img src="/img/password.png" className={styles.loginImg} /> <input className={styles.loginInp}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Password'
                        onChange={(e) => { setPassword(e.target.value) }}
                        ref={el => inputs.current[1] = el}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault()
                                login()
                            }
                        }} />
                    <div className={styles.showOrHidePasswordContainer} onClick={() => { setShowPassword(!showPassword) }}>
                        <img src="/img/notHiddenPasswordIcon.png" className={`${styles.showOrHidePasswordIcon} ${!showPassword ? styles.invisible : styles.visible}`} />
                        <img src="/img/hiddenPasswordIcon.png" className={`${styles.showOrHidePasswordIcon} ${showPassword ? styles.invisible : styles.visible}`} />
                    </div>
                </div>
                <p style={{ display: !correctPassword ? 'block' : 'none' }} className={styles.errorText}>Inccorect username or password!</p>
                <button className={styles.loginButton} onClick={() => login()}>Log in</button>
                <h4>Dont have account?<Link className={styles.loginLink} to='/singup'>Sing up!</Link></h4>
            </div>
        </div>
    )

}
