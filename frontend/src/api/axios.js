
import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const authAPI = {
  login:    (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
}

export const studentAPI = {
  getAll:   ()     => API.get('/students'),
  getOne:   (id)   => API.get(`/students/${id}`),
  create:   (data) => API.post('/students', data),
  update:   (id, data) => API.put(`/students/${id}`, data),
  delete:   (id)   => API.delete(`/students/${id}`),
}

export const roomAPI = {
  getAll:   ()     => API.get('/rooms'),
  getOne:   (id)   => API.get(`/rooms/${id}`),
  create:   (data) => API.post('/rooms', data),
  assign:   (data) => API.post('/rooms/assign', data),
  unassign: (data) => API.post('/rooms/unassign', data),
}

export const feeAPI = {
  getAll:   ()     => API.get('/fees'),
  create:   (data) => API.post('/fees', data),
  markPaid: (id, data) => API.put(`/fees/${id}/pay`, data),
  summary:  ()     => API.get('/fees/summary'),
}

export default API