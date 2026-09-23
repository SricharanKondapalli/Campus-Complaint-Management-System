import { useState } from 'react'

function Login({ onLogin, onRegister }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async (event) => {
        event.preventDefault()
        setError('')

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            if (!response.ok) {
                throw new Error('Invalid email or password')
            }

            const token = await response.text()

            localStorage.setItem('token', token)

            onLogin()
        } catch (error) {
            setError('Invalid email or password')
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Campus Complaint Management System</h1>
                <p className="subtitle">Login to your account</p>

                <form onSubmit={handleLogin}>
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    {error && <p className="error">{error}</p>}

                    <button type="submit">Login</button>
                </form>

                <p className="switch-text">
                    Don't have an account?{' '}
                    <button className="link-button" onClick={onRegister}>
                        Register
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Login