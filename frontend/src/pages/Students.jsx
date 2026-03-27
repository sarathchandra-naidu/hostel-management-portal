import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { studentAPI, roomAPI } from '../api/axios'
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'

// ─── Add/Edit Modal Component ───────────────────────────────────────────────
const StudentModal = ({ student, rooms, onClose, onSave }) => {
  // If editing, prefill form. If adding, start empty
  const [form, setForm] = useState({
    name:        student?.name        ?? '',
    rollNumber:  student?.rollNumber  ?? '',
    email:       student?.email       ?? '',
    phone:       student?.phone       ?? '',
    course:      student?.course      ?? 'B.Tech',
    year:        student?.year        ?? 1,
    address:     student?.address     ?? '',
    feeStatus:   student?.feeStatus   ?? 'Pending',
  })
  const [saving, setSaving] = useState(false)

  // Single handler for ALL inputs — keeps code DRY
  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    // ↑ spread previous state, update only the changed field
    // This is the standard React controlled input pattern
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (student) {
        // Editing existing student
        await studentAPI.update(student._id, form)
        toast.success('Student updated!')
      } else {
        // Creating new student
        await studentAPI.create(form)
        toast.success('Student registered!')
      }
      onSave() // tell parent to refresh list
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    // Backdrop — clicking outside closes modal
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center
                    justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg
                      max-h-[90vh] overflow-y-auto">

        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-lg font-bold text-gray-800">
            {student ? 'Edit Student' : 'Register New Student'}
          </h2>
          <button onClick={onClose}
            className="text-gray-400 hover:text-gray-600">
            <FiX size={20}/>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input name="name" value={form.name} onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Rahul Sharma"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number *
              </label>
              <input name="rollNumber" value={form.rollNumber}
                onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="CS2024001"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input name="email" type="email" value={form.email}
              onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="rahul@email.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone *
              </label>
              <input name="phone" value={form.phone} onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="9876543210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year *
              </label>
              <select name="year" value={form.year} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500">
                {[1,2,3,4,5].map(y => (
                  <option key={y} value={y}>Year {y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course *
              </label>
              <select name="course" value={form.course} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500">
                {['B.Tech','M.Tech','MBA','BCA','MCA','B.Sc','M.Sc'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee Status
              </label>
              <select name="feeStatus" value={form.feeStatus}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address *
            </label>
            <textarea name="address" value={form.address}
              onChange={handleChange} required rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City, State"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2
                         rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg
                         hover:bg-blue-700 disabled:opacity-50 font-medium">
              {saving ? 'Saving...' : student ? 'Update' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Students Page ──────────────────────────────────────────────────────
export default function Students() {
  const [students,     setStudents]     = useState([])
  const [rooms,        setRooms]        = useState([])
  const [loading,      setLoading]      = useState(true)
  const [showModal,    setShowModal]    = useState(false)
  const [editStudent,  setEditStudent]  = useState(null)  // null = add mode
  const [search,       setSearch]       = useState('')

  const fetchStudents = async () => {
    try {
      const [sRes, rRes] = await Promise.all([
        studentAPI.getAll(),
        roomAPI.getAll(),
      ])
      setStudents(sRes.data)
      setRooms(rRes.data)
    } catch {
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStudents() }, [])

  const handleDelete = async (id) => {
    // Confirm before deleting — good UX practice
    if (!window.confirm('Remove this student from hostel?')) return
    try {
      await studentAPI.delete(id)
      toast.success('Student removed')
      fetchStudents() // refresh list
    } catch {
      toast.error('Failed to delete')
    }
  }

  const openAdd  = () => { setEditStudent(null); setShowModal(true) }
  const openEdit = (s)  => { setEditStudent(s);    setShowModal(true) }

  // Client-side search filter
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

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
          <h1 className="text-xl font-bold text-gray-800">Students</h1>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2
                     rounded-lg hover:bg-blue-700 font-medium">
          <FiPlus /> Add Student
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Search bar */}
        <div className="mb-6">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, roll number or email..."
            className="w-full max-w-md border border-gray-300 rounded-lg px-4
                       py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-3 text-sm text-gray-400">
            {filtered.length} student{filtered.length !== 1 ? 's' : ''} found
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-400 mb-4">No students found</p>
              <button onClick={openAdd}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg
                           hover:bg-blue-700">
                Register First Student
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    {['Name','Roll No','Course','Year','Room','Fee Status','Actions']
                      .map(h => (
                      <th key={h}
                        className="px-6 py-3 text-xs font-medium
                                   text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(student => (
                    <tr key={student._id}
                      className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-800">
                          {student.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {student.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {student.course}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        Year {student.year}
                      </td>
                      <td className="px-6 py-4">
                        {student.room?.roomNumber ? (
                          <span className="bg-green-100 text-green-700 px-2
                                           py-1 rounded-full text-xs font-medium">
                            {student.room.roomNumber}
                          </span>
                        ) : (
                          <span className="text-orange-400 text-sm">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs
                          font-medium ${
                          student.feeStatus === 'Paid'
                            ? 'bg-green-100 text-green-700'
                            : student.feeStatus === 'Pending'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {student.feeStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(student)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50
                                       rounded-lg transition-colors">
                            <FiEdit2 size={15}/>
                          </button>
                          <button onClick={() => handleDelete(student._id)}
                            className="p-1.5 text-red-400 hover:bg-red-50
                                       rounded-lg transition-colors">
                            <FiTrash2 size={15}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal — only renders when showModal is true */}
      {showModal && (
        <StudentModal
          student={editStudent}
          rooms={rooms}
          onClose={() => setShowModal(false)}
          onSave={fetchStudents}
        />
      )}
    </div>
  )
}
