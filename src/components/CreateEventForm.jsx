import { useState } from 'react'

function defaultDates() {
  const now = new Date()
  const year = now.getMonth() >= 10 ? now.getFullYear() + 1 : now.getFullYear()
  return {
    start: `${year}-06-01`,
    end:   `${year}-10-31`,
  }
}

function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export default function CreateEventForm({ onSubmit, loading }) {
  const defaults = defaultDates()
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState(defaults.start)
  const [endDate, setEndDate] = useState(defaults.end)
  const [duration, setDuration] = useState(5)

  const minEnd = startDate ? addDays(startDate, duration - 1) : ''
  const valid = name.trim() && startDate && endDate && endDate >= minEnd && duration >= 1

  function handleSubmit(e) {
    e.preventDefault()
    if (!valid) return
    onSubmit(name.trim(), startDate, endDate, duration)
  }

  return (
    <form className="create-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="event-name">Event name</label>
        <input
          id="event-name"
          type="text"
          placeholder="e.g. Motorcycle trip"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={100}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="start-date">Earliest possible date</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="end-date">Latest possible date</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            min={minEnd}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="field field-narrow">
        <label htmlFor="duration">Trip length (days)</label>
        <input
          id="duration"
          type="number"
          min={1}
          max={30}
          value={duration}
          onChange={e => setDuration(Math.max(1, Math.min(30, Number(e.target.value))))}
        />
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={!valid || loading}
      >
        {loading ? 'Creating…' : 'Create event & get link'}
      </button>
    </form>
  )
}
