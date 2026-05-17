import { useRef, useEffect } from 'react'

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
  return (new Date(year, month, 1).getDay() + 6) % 7
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
  const containerRef = useRef(null)

  // Use refs so event listeners always see latest values without re-registering
  const votesRef = useRef(votes)
  const onChangeRef = useRef(onChange)
  const startDateRef = useRef(startDate)
  const endDateRef = useRef(endDate)
  useEffect(() => { votesRef.current = votes }, [votes])
  useEffect(() => { onChangeRef.current = onChange }, [onChange])
  useEffect(() => { startDateRef.current = startDate }, [startDate])
  useEffect(() => { endDateRef.current = endDate }, [endDate])

  const drag = useRef({ active: false, targetState: null, applied: new Set() })

  function startDrag(iso) {
    const cur = votesRef.current[iso] ?? null
    const targetState = CYCLE[String(cur)]
    drag.current = { active: true, targetState, applied: new Set([iso]) }
    onChangeRef.current(iso, targetState)
  }

  function continueDrag(iso) {
    const { active, targetState, applied } = drag.current
    if (!active || applied.has(iso)) return
    applied.add(iso)
    onChangeRef.current(iso, targetState)
  }

  function endDrag() {
    drag.current.active = false
  }

  // Register non-passive touchmove so we can preventDefault (stops page scroll during swipe)
  useEffect(() => {
    const el = containerRef.current
    if (!el || readOnly) return

    function onTouchMove(e) {
      if (!drag.current.active) return
      e.preventDefault()
      const touch = e.touches[0]
      const target = document.elementFromPoint(touch.clientX, touch.clientY)
      const date = target?.dataset?.date
      if (date && date >= startDateRef.current && date <= endDateRef.current) {
        continueDrag(date)
      }
    }

    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', endDrag)
    el.addEventListener('touchcancel', endDrag)
    el.addEventListener('mouseup', endDrag)
    el.addEventListener('mouseleave', endDrag)
    return () => {
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', endDrag)
      el.removeEventListener('touchcancel', endDrag)
      el.removeEventListener('mouseup', endDrag)
      el.removeEventListener('mouseleave', endDrag)
    }
  }, [readOnly])

  return (
    <div className="calendar-root" ref={containerRef}>
      <div className="calendar-legend calendar-legend-top">
        <span className="legend-item"><span className="legend-swatch swatch-ok" /> Available</span>
        <span className="legend-item"><span className="legend-swatch swatch-prefer" /> 1 tap: Prefer not</span>
        <span className="legend-item"><span className="legend-swatch swatch-cant" /> 2 taps: Can't join</span>
        {!readOnly && <span className="legend-item legend-reset">3 taps: reset · swipe to select range</span>}
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
                    !inRange ? 'day-out' : 'day-avail',
                    inRange && vote === 'prefer_not' ? 'day-prefer' : '',
                    inRange && vote === 'cant' ? 'day-cant' : '',
                    inRange && !readOnly ? 'day-clickable' : '',
                  ].filter(Boolean).join(' ')
                  return (
                    <div
                      key={iso}
                      className={cls}
                      data-date={inRange ? iso : undefined}
                      onMouseDown={() => !readOnly && inRange && startDrag(iso)}
                      onMouseEnter={() => !readOnly && inRange && continueDrag(iso)}
                      onTouchStart={!readOnly && inRange ? (e) => { e.preventDefault(); startDrag(iso) } : undefined}
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
    </div>
  )
}
