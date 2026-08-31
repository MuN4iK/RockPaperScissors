import { Link, useNavigate } from 'react-router-dom'
import styles from '../styles/SingupPage.module.css'
import { useRef, useState } from 'react'
import checkPassword from '../functions/checkPassword'

export default function SingupPage() {
    const inputs = useRef([])
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [correctPassword, setCorrectPassword] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    function handleKeyDown(e, nextIndexNuber) {
        if (e.key === 'Enter') {
            e.preventDefault()
            inputs.current[nextIndexNuber]?.focus()
        }
    }

    async function singup() {
        if (checkPassword(password)) {
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
                        ref={el => inputs.current[0] = el}
                        onKeyDown={e => { handleKeyDown(e, 1) }}
                    />
                </div>
                <div className={styles.singupDiv}>
                    <img src="/img/password.png" className={styles.singupImg} /> <input className={styles.singupInp}
                        type={showPassword ? 'text' : 'password'}

                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        ref={el => inputs.current[1] = el}
                        onKeyDown={e => { handleKeyDown(e, 2) }}
                    />
                    <div className={styles.showOrHidePasswordContainer} onClick={() => { setShowPassword(!showPassword) }}>
                        <img src="/img/notHiddenPasswordIcon.png" className={`${styles.showOrHidePasswordIcon} ${!showPassword ? styles.invisible : styles.visible}`} />
                        <img src="/img/hiddenPasswordIcon.png" className={`${styles.showOrHidePasswordIcon} ${showPassword ? styles.invisible : styles.visible}`} />
                    </div>
                    <img src="/img/info.png" className={styles.infoImg} title={` Password must have atleast: \n •8 characters\n •one uppercase character\n •one number`} />
                </div>
                <div className={styles.singupDiv}>
                    <img src="/img/password.png" className={styles.singupImg} /> <input className={styles.singupInp}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Repeat password'
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        ref={el => inputs.current[2] = el}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                singup()
                            }
                        }}

                    />

                </div>
                {!correctPassword && <p className={styles.errorText}>Passwords do not match or isn`t correct!</p>}
                <button className={styles.singupButton} onClick={() => singup()} >Create account</button>
                <h4 className={styles.bottomText}>Already have account?<Link className={styles.singupLink} to='/login'>Log in!</Link></h4>
            </div>
        </div>
    )
}
