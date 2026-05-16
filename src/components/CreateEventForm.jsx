import { useState } from 'react'
import DatePicker from './DatePicker.jsx'

export default function CreateEventForm({ onSubmit, loading }) {
  const [name, setName] = useState('')
  const [dates, setDates] = useState([])

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || dates.length === 0) return
    onSubmit(name.trim(), dates)
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="event-name">Event name</label>
        <input
          id="event-name"
          type="text"
          placeholder="e.g. Team dinner"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={100}
        />
      </div>

      <div className="field">
        <label>Candidate dates</label>
        <DatePicker dates={dates} onChange={setDates} />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={!name.trim() || dates.length === 0 || loading}
      >
        {loading ? 'Creating…' : 'Create event & get link'}
      </button>
    </form>
  )
}
