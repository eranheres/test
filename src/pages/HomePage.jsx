import { useState } from 'react'
import CreateEventForm from '../components/CreateEventForm.jsx'
import { createEvent } from '../hooks/useEvent.js'

export default function HomePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleCreate(name, startDate, endDate, duration) {
    setLoading(true)
    setError(null)
    try {
      const id = await createEvent(name, startDate, endDate, duration)
      window.location.hash = `#/event/${id}`
    } catch (e) {
      setError('Failed to create event. Check your Firebase config.')
      setLoading(false)
    }
  }

  return (
    <div className="page center-page">
      <header className="app-header">
        <img src="./spyder.svg" alt="Logo" className="logo" />
        <h1>When Can We Meet?</h1>
        <p className="subtitle">Create an event, share the link, and find the best date for everyone.</p>
      </header>
      <main className="card">
        <h2>New event</h2>
        {error && <p className="error-msg">{error}</p>}
        <CreateEventForm onSubmit={handleCreate} loading={loading} />
      </main>
    </div>
  )
}
