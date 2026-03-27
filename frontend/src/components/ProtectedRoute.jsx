// src/components/ProtectedRoute.jsx
// PURPOSE: Block pages from users who aren't logged in
// If not logged in → redirect to /login automatically

import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // Still checking localStorage — show nothing yet
  if (loading) return <div className="flex items-center justify-center h-screen">
    <p className="text-gray-500">Loading...</p>
  </div>

  // Not logged in → kick to login page
  if (!user) return <Navigate to="/login" replace />

  // Logged in → show the actual page
  return children
}

export default ProtectedRoute