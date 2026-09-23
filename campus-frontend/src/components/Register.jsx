import { useState } from 'react'

function Register({ onBackToLogin }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleRegister = async (event) => {
        event.preventDefault()

        setMessage('')
        setError('')

        try {
            const response = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: 'STUDENT',
                }),
            })

            if (!response.ok) {
                throw new Error('Registration failed')
            }

            setMessage('Registration successful! You can now login.')
            setName('')
            setEmail('')
            setPassword('')
        } catch (error) {
            setError('Registration failed. Please try again.')
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p className="subtitle">Register as a student</p>

                <form onSubmit={handleRegister}>
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />

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
                        placeholder="Create a password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    {error && <p className="error">{error}</p>}
                    {message && <p className="success">{message}</p>}

                    <button type="submit">Register</button>
                </form>

                <p className="switch-text">
                    Already have an account?{' '}
                    <button className="link-button" onClick={onBackToLogin}>
                        Login
                    </button>
                </p>
            </div>
        </div>
    )
}

export default Register