import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { studentAPI, roomAPI, feeAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { FiUsers, FiHome, FiDollarSign, FiAlertCircle, FiLogOut } from 'react-icons/fi'
import toast from 'react-hot-toast'

// Reusable stat card component — defined in same file for now
const StatCard = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value ?? '...'}</p>
    </div>
  </div>
)

export default function Dashboard() {
  const { user, logout } = useAuth()

  // State for all our stats
  const [stats, setStats] = useState({
    totalStudents:   null,
    totalRooms:      null,
    availableRooms:  null,
    pendingFees:     null,
  })
  const [recentStudents, setRecentStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch all data at once using Promise.all
    // Why Promise.all? Runs ALL requests SIMULTANEOUSLY — faster than one by one!
    const fetchData = async () => {
      try {
        const [studentsRes, roomsRes, feesRes] = await Promise.all([
          studentAPI.getAll(),
          roomAPI.getAll(),
          feeAPI.summary(),
        ])

        const students = studentsRes.data
        const rooms    = roomsRes.data
        const fees     = feesRes.data

        // Calculate stats from the data
        const pendingFee = fees.find(f => f._id === 'Pending')

        setStats({
          totalStudents:  students.length,
          totalRooms:     rooms.length,
          availableRooms: rooms.filter(r => r.status === 'Available').length,
          pendingFees:    pendingFee?.count ?? 0,
        })

        // Show only 5 most recent students
        setRecentStudents(students.slice(0, 5))

      } catch (err) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) // [] = run once when component mounts

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">🏠 Hostel Management</h1>
        <div className="flex items-center gap-6">
          <Link to="/students" className="text-gray-600 hover:text-blue-600 font-medium">Students</Link>
          <Link to="/rooms"    className="text-gray-600 hover:text-blue-600 font-medium">Rooms</Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-500 mt-1">Here's what's happening in your hostel today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<FiUsers className="text-blue-600 text-xl"/>}
            label="Total Students"
            value={stats.totalStudents}
            color="bg-blue-50"
          />
          <StatCard
            icon={<FiHome className="text-green-600 text-xl"/>}
            label="Total Rooms"
            value={stats.totalRooms}
            color="bg-green-50"
          />
          <StatCard
            icon={<FiHome className="text-purple-600 text-xl"/>}
            label="Available Rooms"
            value={stats.availableRooms}
            color="bg-purple-50"
          />
          <StatCard
            icon={<FiAlertCircle className="text-red-500 text-xl"/>}
            label="Pending Fees"
            value={stats.pendingFees}
            color="bg-red-50"
          />
        </div>

        {/* Recent Students Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Recent Students</h3>
            <Link
              to="/students"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading...</div>
          ) : recentStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No students yet. <Link to="/students" className="text-blue-600 hover:underline">Add one →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Roll No</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Room</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Fee Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                      <td className="px-6 py-4 text-gray-500">{student.rollNumber}</td>
                      <td className="px-6 py-4 text-gray-500">{student.course}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {student.room?.roomNumber ?? (
                          <span className="text-orange-400 text-sm">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.feeStatus === 'Paid'    ? 'bg-green-100 text-green-700' :
                          student.feeStatus === 'Pending' ? 'bg-red-100 text-red-600'    :
                                                            'bg-yellow-100 text-yellow-700'
                        }`}>
                          {student.feeStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <Link to="/students"
            className="bg-blue-600 text-white rounded-xl p-5 hover:bg-blue-700 transition-colors text-center">
            <FiUsers className="text-2xl mx-auto mb-2"/>
            <p className="font-semibold">Manage Students</p>
            <p className="text-blue-200 text-sm mt-1">Register, edit, view all</p>
          </Link>
          <Link to="/rooms"
            className="bg-green-600 text-white rounded-xl p-5 hover:bg-green-700 transition-colors text-center">
            <FiHome className="text-2xl mx-auto mb-2"/>
            <p className="font-semibold">Manage Rooms</p>
            <p className="text-green-200 text-sm mt-1">Allocate and track rooms</p>
          </Link>
          <Link to="/students"
            className="bg-purple-600 text-white rounded-xl p-5 hover:bg-purple-700 transition-colors text-center">
            <FiDollarSign className="text-2xl mx-auto mb-2"/>
            <p className="font-semibold">Fee Management</p>
            <p className="text-purple-200 text-sm mt-1">Track and collect fees</p>
          </Link>
        </div>

      </div>
    </div>
  )
}

