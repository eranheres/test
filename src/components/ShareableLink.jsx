import { useState } from 'react'

export default function ShareableLink({ eventId }) {
  const [copied, setCopied] = useState(false)
  const url = `${window.location.origin}${window.location.pathname}#/event/${eventId}`

  function copy() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="share-link">
      <span className="share-url">{url}</span>
      <button type="button" className="btn-copy" onClick={copy}>
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}
