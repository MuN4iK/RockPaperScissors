import { Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const token = localStorage.getItem('token')

    async function checkToken() {
        if (!token) {
            setIsChecking(false);
            return;
        }
        try {
            const response = await fetch('/api/me',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            const data = await response.json()
            if (data.isTokenWorking === false) {
                localStorage.removeItem('token')
                setIsChecking(false)
                setIsAuthenticated(false)
            } else if (data.isTokenWorking === true) {
                console.log(true)
                setIsChecking(false)
                setIsAuthenticated(true)
            }
        } catch (err) {
            console.err(err)
            setIsAuthenticated(false);
        } finally {

            setIsChecking(false);

        }
    }

    useEffect(() => {
        checkToken()
    }, [token])


    if (isChecking) {
        return <h1>Loading...</h1>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children
}
