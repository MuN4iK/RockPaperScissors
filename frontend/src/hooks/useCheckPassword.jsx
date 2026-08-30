export default function useCheckPassword({ password }) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (passwordRegex.test(password)) {
        return true
    } else {
        return false
    }

}
