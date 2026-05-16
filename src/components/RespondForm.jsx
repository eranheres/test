import { useState } from 'react'
import DateCard from './DateCard.jsx'

export default function RespondForm({ eventId, dates, onSubmit }) {
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

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      const fullVotes = Object.fromEntries(dates.map(d => [d, votes[d] ?? null]))
      await onSubmit(name.trim(), fullVotes)
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

      <div className="date-list">
        {dates.map(d => (
          <DateCard
            key={d}
            date={d}
            value={votes[d] ?? null}
            onChange={val => setVotes(prev => ({ ...prev, [d]: val }))}
          />
        ))}
      </div>

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
