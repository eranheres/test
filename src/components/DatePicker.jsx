import { useState } from 'react'

function formatDisplay(iso) {
  const [y, m, d] = iso.split('-')
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function DatePicker({ dates, onChange }) {
  const [input, setInput] = useState('')

  function addDate() {
    if (!input || dates.includes(input)) return
    const next = [...dates, input].sort()
    onChange(next)
    setInput('')
  }

  function removeDate(d) {
    onChange(dates.filter(x => x !== d))
  }

  return (
    <div className="date-picker">
      <div className="date-picker-input">
        <input
          type="date"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addDate()}
        />
        <button type="button" onClick={addDate} disabled={!input}>
          Add date
        </button>
      </div>
      {dates.length > 0 && (
        <ul className="date-chips">
          {dates.map(d => (
            <li key={d} className="chip">
              {formatDisplay(d)}
              <button type="button" onClick={() => removeDate(d)} aria-label="Remove">×</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
