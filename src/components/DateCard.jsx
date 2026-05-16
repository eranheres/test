function formatDisplay(iso) {
  const [y, m, d] = iso.split('-')
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function DateCard({ date, value, onChange }) {
  return (
    <div className="date-card">
      <span className="date-label">{formatDisplay(date)}</span>
      <div className="date-options">
        {[
          { val: null,         label: "Available",    cls: "opt-ok" },
          { val: 'prefer_not', label: "Prefer not",   cls: "opt-soft" },
          { val: 'cant',       label: "Can't join",   cls: "opt-hard" },
        ].map(({ val, label, cls }) => (
          <label key={String(val)} className={`opt-label ${cls} ${value === val ? 'selected' : ''}`}>
            <input
              type="radio"
              name={`date-${date}`}
              checked={value === val}
              onChange={() => onChange(val)}
            />
            {label}
          </label>
        ))}
      </div>
    </div>
  )
}
