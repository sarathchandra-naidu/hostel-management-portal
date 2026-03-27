import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { roomAPI, studentAPI } from '../api/axios'
import { FiPlus, FiArrowLeft, FiX, FiUsers } from 'react-icons/fi'
import toast from 'react-hot-toast'

// ── Room Card Component ───────────────────────────────────────────────────────
const RoomCard = ({ room, onAssign, onUnassign }) => {
  const isFull      = room.status === 'Full'
  const isAvailable = room.status === 'Available'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5
                    hover:shadow-md transition-shadow">

      {/* Room header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">
            Room {room.roomNumber}
          </h3>
          <p className="text-sm text-gray-400">
            Floor {room.floor} · {room.type}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isFull        ? 'bg-red-100 text-red-600'    :
          isAvailable   ? 'bg-green-100 text-green-700' :
                          'bg-yellow-100 text-yellow-700'
        }`}>
          {room.status}
        </span>
      </div>

      {/* Occupancy bar — visual indicator */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Occupancy</span>
          <span>{room.occupiedCount}/{room.capacity}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isFull ? 'bg-red-400' : 'bg-green-400'
            }`}
            style={{
              width: `${(room.occupiedCount / room.capacity) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Rent */}
      <p className="text-sm text-gray-500 mb-4">
        ₹{room.monthlyRent.toLocaleString()}/month
      </p>

      {/* Amenities */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {room.amenities?.hasAC &&
          <span className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5
                           rounded-full">AC</span>}
        {room.amenities?.hasAttachedBath &&
          <span className="bg-purple-50 text-purple-600 text-xs px-2 py-0.5
                           rounded-full">Attached Bath</span>}
        {room.amenities?.hasWifi &&
          <span className="bg-green-50 text-green-600 text-xs px-2 py-0.5
                           rounded-full">WiFi</span>}
      </div>

      {/* Students in this room */}
      {room.students?.length > 0 && (
        <div className="mb-4 border-t pt-3">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Current Occupants
          </p>
          {room.students.map(s => (
            <div key={s._id}
              className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-700">{s.name}</span>
              <button
                onClick={() => onUnassign(s._id, room._id)}
                className="text-xs text-red-400 hover:text-red-600
                           hover:underline">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Assign button */}
      {!isFull && (
        <button
          onClick={() => onAssign(room)}
          className="w-full flex items-center justify-center gap-2 border
                     border-blue-500 text-blue-600 py-2 rounded-lg
                     hover:bg-blue-50 text-sm font-medium transition-colors">
          <FiUsers size={14}/> Assign Student
        </button>
      )}
    </div>
  )
}

// ── Add Room Modal ────────────────────────────────────────────────────────────
const AddRoomModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({
    roomNumber:  '',
    floor:       1,
    type:        'Single',
    capacity:    1,
    monthlyRent: '',
    amenities: {
      hasAC:          false,
      hasAttachedBath: false,
      hasWifi:         true,
    }
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleAmenity = (key) => {
    setForm(prev => ({
      ...prev,
      amenities: { ...prev.amenities, [key]: !prev.amenities[key] }
    }))
  }

  // Auto-set capacity based on room type
  const handleTypeChange = (e) => {
    const type = e.target.value
    const capacityMap = { Single:1, Double:2, Triple:3, Dormitory:6 }
    setForm(prev => ({
      ...prev,
      type,
      capacity: capacityMap[type]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await roomAPI.create(form)
      toast.success('Room created!')
      onSave()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center
                    justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">Add New Room</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FiX size={20}/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Number *
              </label>
              <input name="roomNumber" value={form.roomNumber}
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="B102"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Floor *
              </label>
              <input name="floor" type="number" value={form.floor}
                onChange={handleChange} required min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type *
              </label>
              <select name="type" value={form.type} onChange={handleTypeChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['Single','Double','Triple','Dormitory'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacity (auto)
              </label>
              <input name="capacity" type="number" value={form.capacity}
                readOnly
                className="w-full border border-gray-200 bg-gray-50 rounded-lg
                           px-3 py-2 text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Rent (₹) *
            </label>
            <input name="monthlyRent" type="number" value={form.monthlyRent}
              onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="5000"
            />
          </div>

          {/* Amenities checkboxes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="flex gap-4">
              {[
                { key:'hasAC',          label:'AC'            },
                { key:'hasAttachedBath',label:'Attached Bath' },
                { key:'hasWifi',        label:'WiFi'          },
              ].map(({ key, label }) => (
                <label key={key}
                  className="flex items-center gap-2 text-sm text-gray-600
                             cursor-pointer">
                  <input type="checkbox"
                    checked={form.amenities[key]}
                    onChange={() => handleAmenity(key)}
                    className="rounded"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2
                         rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg
                         hover:bg-blue-700 disabled:opacity-50 font-medium">
              {saving ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Assign Student Modal ──────────────────────────────────────────────────────
const AssignModal = ({ room, students, onClose, onSave }) => {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [saving, setSaving]                   = useState(false)

  // Only show students who don't have a room yet
  const unassigned = students.filter(s => !s.room)

  const handleAssign = async () => {
    if (!selectedStudent) return toast.error('Select a student first')
    setSaving(true)
    try {
      await roomAPI.assign({ studentId: selectedStudent, roomId: room._id })
      toast.success('Room assigned!')
      onSave()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Assignment failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center
                    justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Assign to Room {room.roomNumber}
          </h2>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-600">
            <FiX size={20}/>
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Available spots: {room.capacity - room.occupiedCount}
        </p>

        {unassigned.length === 0 ? (
          <p className="text-center text-gray-400 py-4">
            All students are already assigned to rooms.
          </p>
        ) : (
          <>
            <select
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4
                         focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">-- Select a student --</option>
              {unassigned.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.rollNumber})
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-2
                           rounded-lg hover:bg-gray-50 font-medium">
                Cancel
              </button>
              <button onClick={handleAssign} disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg
                           hover:bg-blue-700 disabled:opacity-50 font-medium">
                {saving ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── Main Rooms Page ───────────────────────────────────────────────────────────
export default function Rooms() {
  const [rooms,       setRooms]       = useState([])
  const [students,    setStudents]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [showAddRoom, setShowAddRoom] = useState(false)
  const [assignRoom,  setAssignRoom]  = useState(null) // room being assigned

  const fetchData = async () => {
    try {
      const [rRes, sRes] = await Promise.all([
        roomAPI.getAll(),
        studentAPI.getAll(),
      ])
      setRooms(rRes.data)
      setStudents(sRes.data)
    } catch {
      toast.error('Failed to load rooms')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleUnassign = async (studentId) => {
    if (!window.confirm('Remove this student from the room?')) return
    try {
      await roomAPI.unassign({ studentId })
      toast.success('Student removed from room')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to unassign')
    }
  }

  // Stats
  const available = rooms.filter(r => r.status === 'Available').length
  const full      = rooms.filter(r => r.status === 'Full').length

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex
                      justify-between items-center">
        <div className="flex items-center gap-3">
          <Link to="/dashboard"
            className="text-gray-400 hover:text-gray-600">
            <FiArrowLeft size={20}/>
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Rooms</h1>
        </div>
        <button onClick={() => setShowAddRoom(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2
                     rounded-lg hover:bg-blue-700 font-medium">
          <FiPlus /> Add Room
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label:'Total Rooms',     value: rooms.length, color:'text-gray-800'  },
            { label:'Available',       value: available,    color:'text-green-600' },
            { label:'Full',            value: full,         color:'text-red-500'   },
          ].map(({ label, value, color }) => (
            <div key={label}
              className="bg-white rounded-xl p-4 text-center shadow-sm
                         border border-gray-100">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-sm text-gray-400 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Rooms grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No rooms added yet</p>
            <button onClick={() => setShowAddRoom(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Add First Room
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map(room => (
              <RoomCard
                key={room._id}
                room={room}
                onAssign={setAssignRoom}
                onUnassign={handleUnassign}
              />
            ))}
          </div>
        )}
      </div>

      {showAddRoom && (
        <AddRoomModal
          onClose={() => setShowAddRoom(false)}
          onSave={fetchData}
        />
      )}

      {assignRoom && (
        <AssignModal
          room={assignRoom}
          students={students}
          onClose={() => setAssignRoom(null)}
          onSave={fetchData}
        />
      )}
    </div>
  )
}
