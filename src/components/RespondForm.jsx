import { useState } from 'react'
import Calendar from './Calendar.jsx'

function formatDate(iso) {
  const [y, m, d] = iso.split('-')
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function SelectionSummary({ votes }) {
  const cant = Object.keys(votes).filter(d => votes[d] === 'cant').sort()
  const prefer = Object.keys(votes).filter(d => votes[d] === 'prefer_not').sort()
  if (!cant.length && !prefer.length) return null
  return (
    <div className="selection-summary">
      <div className="summary-title">Your selections:</div>
      {cant.length > 0 && (
        <div className="summary-row summary-cant">
          <span className="summary-dot dot-cant" /> Can't join ({cant.length}): {cant.map(formatDate).join(', ')}
        </div>
      )}
      {prefer.length > 0 && (
        <div className="summary-row summary-prefer">
          <span className="summary-dot dot-prefer" /> Prefer not ({prefer.length}): {prefer.map(formatDate).join(', ')}
        </div>
      )}
    </div>
  )
}

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

      <SelectionSummary votes={votes} />

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
