function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

function monthsBetween(startDate, endDate) {
  const months = []
  const s = new Date(startDate + 'T00:00:00')
  const e = new Date(endDate + 'T00:00:00')
  let y = s.getFullYear(), m = s.getMonth()
  while (y < e.getFullYear() || (y === e.getFullYear() && m <= e.getMonth())) {
    months.push({ year: y, month: m })
    if (++m > 11) { m = 0; y++ }
  }
  return months
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function firstWeekday(year, month) {
  return (new Date(year, month, 1).getDay() + 6) % 7 // Mon=0 … Sun=6
}

function isoDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December']
const WEEKDAYS = ['Mo','Tu','We','Th','Fr','Sa','Su']

const CYCLE = { null: 'prefer_not', prefer_not: 'cant', cant: null }

export default function Calendar({ startDate, endDate, votes = {}, onChange, readOnly = false }) {
  const months = monthsBetween(startDate, endDate)

  function handleClick(iso) {
    if (readOnly) return
    const cur = votes[iso] ?? null
    onChange(iso, CYCLE[cur])
  }

  return (
    <div className="calendar-root">
      <div className="calendar-legend calendar-legend-top">
        <span className="legend-item"><span className="legend-swatch swatch-ok" /> Available</span>
        <span className="legend-item"><span className="legend-swatch swatch-prefer" /> Prefer not</span>
        <span className="legend-item"><span className="legend-swatch swatch-cant" /> Can't join</span>
        {!readOnly && <span className="legend-hint">Tap a day to cycle through states</span>}
      </div>
      <div className="calendar-months">
        {months.map(({ year, month }) => {
          const total = daysInMonth(year, month)
          const offset = firstWeekday(year, month)
          const cells = []
          for (let i = 0; i < offset; i++) cells.push(null)
          for (let d = 1; d <= total; d++) cells.push(d)

          return (
            <div key={`${year}-${month}`} className="month-block">
              <div className="month-name">{MONTH_NAMES[month]} {year}</div>
              <div className="month-grid">
                {WEEKDAYS.map(w => <div key={w} className="weekday-label">{w}</div>)}
                {cells.map((day, i) => {
                  if (day === null) return <div key={`e${i}`} />
                  const iso = isoDate(year, month, day)
                  const inRange = iso >= startDate && iso <= endDate
                  const vote = votes[iso] ?? null
                  const cls = [
                    'day-cell',
                    !inRange ? 'day-out' : '',
                    inRange && vote === 'prefer_not' ? 'day-prefer' : '',
                    inRange && vote === 'cant' ? 'day-cant' : '',
                    inRange && !readOnly ? 'day-clickable' : '',
                  ].filter(Boolean).join(' ')
                  return (
                    <div
                      key={iso}
                      className={cls}
                      onClick={() => inRange && handleClick(iso)}
                      title={
                        !inRange ? '' :
                        vote === 'cant' ? "Can't join" :
                        vote === 'prefer_not' ? 'Prefer not' : 'Available'
                      }
                    >
                      {day}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      {!readOnly && (
        <div className="calendar-legend">
          <span className="legend-item"><span className="legend-swatch swatch-ok" /> Available</span>
          <span className="legend-item"><span className="legend-swatch swatch-prefer" /> Prefer not</span>
          <span className="legend-item"><span className="legend-swatch swatch-cant" /> Can't join</span>
          <span className="legend-hint">Click a day to cycle through states</span>
        </div>
      )}
    </div>
  )
}
