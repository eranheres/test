import { useState } from 'react'
import Calendar from './Calendar.jsx'

export default function RespondForm({ eventId, startDate, endDate, onSubmit }) {
  const [name, setName] = useState('')
  const [votes, setVotes] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const alreadyKey = `submitted_${eventId}`
  if (localStorage.getItem(alreadyKey)) {
    return (
      <div className="already-responded">
        <p>You already responded. Your availability is shown in the summary.</p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="thank-you">
        <p>Thanks! Your availability has been saved.</p>
      </div>
    )
  }

  function handleDayChange(date, val) {
    setVotes(prev => ({ ...prev, [date]: val }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      await onSubmit(name.trim(), votes)
      localStorage.setItem(alreadyKey, '1')
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="respond-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="your-name">Your name</label>
        <input
          id="your-name"
          type="text"
          placeholder="e.g. Alice"
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength={50}
        />
      </div>

      <Calendar
        startDate={startDate}
        endDate={endDate}
        votes={votes}
        onChange={handleDayChange}
      />

      <button
        type="submit"
        className="btn-primary"
        disabled={!name.trim() || submitting}
      >
        {submitting ? 'Saving…' : 'Save my availability'}
      </button>
    </form>
  )
}
