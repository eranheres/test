function addDays(iso, n) {
  const d = new Date(iso + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

function formatRange(start, end) {
  const s = new Date(start + 'T00:00:00')
  const e = new Date(end + 'T00:00:00')
  const fmt = { month: 'short', day: 'numeric' }
  if (s.getFullYear() !== e.getFullYear())
    return `${s.toLocaleDateString(undefined, { ...fmt, year: 'numeric' })} – ${e.toLocaleDateString(undefined, { ...fmt, year: 'numeric' })}`
  if (s.getMonth() === e.getMonth())
    return `${s.toLocaleDateString(undefined, fmt)} – ${e.getDate()}, ${s.getFullYear()}`
  return `${s.toLocaleDateString(undefined, fmt)} – ${e.toLocaleDateString(undefined, fmt)}, ${s.getFullYear()}`
}

function scoreWindows(startDate, endDate, duration, responses) {
  const lastStart = addDays(endDate, -(duration - 1))
  const windows = []
  let cur = startDate
  while (cur <= lastStart) {
    const windowDates = Array.from({ length: duration }, (_, i) => addDays(cur, i))
    let cant = 0, preferNot = 0
    for (const r of responses) {
      for (const d of windowDates) {
        if (r.votes?.[d] === 'cant') cant++
        else if (r.votes?.[d] === 'prefer_not') preferNot++
      }
    }
    windows.push({ start: cur, end: addDays(cur, duration - 1), cant, preferNot })
    cur = addDays(cur, 1)
  }
  windows.sort((a, b) => a.cant !== b.cant ? a.cant - b.cant : a.preferNot - b.preferNot)
  return windows
}

const MEDALS = ['🏆', '🥈', '🥉', '#4', '#5']

export default function WindowSummary({ startDate, endDate, duration, responses }) {
  if (!responses.length) {
    return <p className="empty-msg">No responses yet — share the link with your friends!</p>
  }

  const windows = scoreWindows(startDate, endDate, duration, responses).slice(0, 5)
  const totalVotes = responses.length * duration

  return (
    <div className="window-list">
      {windows.map(({ start, end, cant, preferNot }, i) => {
        const available = totalVotes - cant - preferNot
        return (
          <div key={start} className={`window-card ${i === 0 ? 'window-best' : ''}`}>
            <div className="window-rank">{MEDALS[i]}</div>
            <div className="window-info">
              <div className="window-range">{formatRange(start, end)}</div>
              <div className="window-score">
                <span className="s-ok">{available}✓ available</span>
                {preferNot > 0 && <span className="s-prefer"> · {preferNot}~ prefer not</span>}
                {cant > 0 && <span className="s-cant"> · {cant}✗ can't</span>}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
