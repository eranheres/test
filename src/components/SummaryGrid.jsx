function formatDisplay(iso) {
  const [y, m, d] = iso.split('-')
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function scoreDate(date, responses) {
  let cant = 0, preferNot = 0, available = 0
  for (const r of responses) {
    const v = r.votes?.[date]
    if (v === 'cant') cant++
    else if (v === 'prefer_not') preferNot++
    else available++
  }
  return { cant, preferNot, available }
}

function cellMark(vote) {
  if (vote === 'cant') return { symbol: '✗', cls: 'cell-cant' }
  if (vote === 'prefer_not') return { symbol: '~', cls: 'cell-prefer' }
  return { symbol: '✓', cls: 'cell-ok' }
}

export default function SummaryGrid({ dates, responses }) {
  if (responses.length === 0) {
    return <p className="empty-msg">No responses yet. Share the link with your friends!</p>
  }

  const scored = dates.map(d => ({ date: d, ...scoreDate(d, responses) }))
  const sorted = [...scored].sort((a, b) =>
    a.cant !== b.cant ? a.cant - b.cant :
    a.preferNot !== b.preferNot ? a.preferNot - b.preferNot :
    b.available - a.available
  )
  const bestDate = sorted[0]?.date

  return (
    <div className="summary-wrapper">
      <table className="summary-grid">
        <thead>
          <tr>
            <th>Date</th>
            {responses.map(r => <th key={r.id}>{r.name}</th>)}
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {dates.map(date => {
            const { cant, preferNot, available } = scoreDate(date, responses)
            const isBest = date === bestDate && responses.length > 0
            const rowCls = cant > 0 ? 'row-cant' : preferNot > 0 ? 'row-prefer' : 'row-ok'
            return (
              <tr key={date} className={`${rowCls} ${isBest ? 'row-best' : ''}`}>
                <td className="date-cell">
                  {isBest && <span className="best-badge">Best</span>}
                  {formatDisplay(date)}
                </td>
                {responses.map(r => {
                  const { symbol, cls } = cellMark(r.votes?.[date])
                  return <td key={r.id} className={`vote-cell ${cls}`}>{symbol}</td>
                })}
                <td className="score-cell">
                  <span className="s-ok">{available}✓</span>
                  {preferNot > 0 && <span className="s-prefer"> {preferNot}~</span>}
                  {cant > 0 && <span className="s-cant"> {cant}✗</span>}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
