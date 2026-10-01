import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function App() {
  const [meetings, setMeetings] = useState([])
  const [title, setTitle] = useState('')
  const [organizerEmail, setOrganizerEmail] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000/api/meetings' : '/api/meetings'

  const fetchMeetings = async () => {
    try {
      const res = await axios.get(API_URL)
      setMeetings(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchMeetings()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(API_URL, {
        title,
        organizer_email: organizerEmail,
        start_time: new Date(startTime).toISOString(),
        end_time: new Date(endTime).toISOString(),
        description: 'Created via Web UI'
      })
      setTitle('')
      setOrganizerEmail('')
      setStartTime('')
      setEndTime('')
      fetchMeetings()
    } catch (err) {
      alert('Error creating meeting: ' + (err.response?.data?.detail?.[0]?.msg || err.message))
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchMeetings()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 800, margin: '40px auto', padding: 20 }}>
      <h1>📅 Meeting Planner</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, background: '#f5f5f5', padding: 20, borderRadius: 8 }}>
        <h3>Schedule a Meeting</h3>
        <input placeholder="Meeting Title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ padding: 8 }} />
        <input type="email" placeholder="Organizer Email" value={organizerEmail} onChange={(e) => setOrganizerEmail(e.target.value)} required style={{ padding: 8 }} />
        <label>Start Time: <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required style={{ padding: 8 }} /></label>
        <label>End Time: <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required style={{ padding: 8 }} /></label>
        <button type="submit" style={{ padding: 10, background: '#0284c7', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Create Meeting</button>
      </form>

      <h2 style={{ marginTop: 40 }}>Scheduled Meetings</h2>
      {meetings.length === 0 ? <p>No meetings found.</p> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {meetings.map((m) => (
            <li key={m.id} style={{ border: '1px solid #ddd', padding: 15, borderRadius: 6, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{m.title}</strong> — {m.organizer_email}<br />
                <small>{new Date(m.start_time).toLocaleString()} — {new Date(m.end_time).toLocaleString()}</small>
              </div>
              <button onClick={() => handleDelete(m.id)} style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
