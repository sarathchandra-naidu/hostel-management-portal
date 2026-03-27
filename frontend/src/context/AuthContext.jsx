// src/context/AuthContext.jsx
// PURPOSE: Share login state across ALL components
// Without this, every component would need to check localStorage separately

import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../api/axios'

// Step 1: Create the context (like a "global variable" for React)
const AuthContext = createContext()

// Step 2: Provider wraps the whole app — shares state with everyone inside
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load — check if user was already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    const token     = localStorage.getItem('token')

    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const response = await authAPI.login({ email, password })
    const data = response.data

    // Save to localStorage so user stays logged in on refresh
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data))

    setUser(data)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Step 3: Custom hook — easy way to use auth anywhere
// Usage: const { user, login, logout } = useAuth()
export const useAuth = () => useContext(AuthContext)