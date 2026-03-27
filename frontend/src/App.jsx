import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login     from './pages/Login'
import Dashboard from './pages/Dashboard'
import Students  from './pages/Students'
import Rooms     from './pages/Rooms'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Public route — anyone can access */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes — must be logged in */}
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          }/>
          <Route path="/students" element={
            <ProtectedRoute><Students /></ProtectedRoute>
          }/>
          <Route path="/rooms" element={
            <ProtectedRoute><Rooms /></ProtectedRoute>
          }/>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App