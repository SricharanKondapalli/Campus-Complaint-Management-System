import { useState } from 'react'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const [page, setPage] = useState(
      localStorage.getItem('token') ? 'dashboard' : 'login'
  )

  const handleLogin = () => {
    setPage('dashboard')
  }

  const handleLogout = () => {
    setPage('login')
  }

  if (page === 'login') {
    return (
        <Login
            onLogin={handleLogin}
            onRegister={() => setPage('register')}
        />
    )
  }

  if (page === 'register') {
    return (
        <Register
            onBackToLogin={() => setPage('login')}
        />
    )
  }

  return <Dashboard onLogout={handleLogout} />
}

export default App