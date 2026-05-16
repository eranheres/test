import { useEvent, submitResponse } from '../hooks/useEvent.js'
import RespondForm from '../components/RespondForm.jsx'
import SummaryGrid from '../components/SummaryGrid.jsx'
import ShareableLink from '../components/ShareableLink.jsx'

export default function EventPage({ id }) {
  const { event, responses, loading, error } = useEvent(id)

  if (loading) return <div className="page center-page"><p className="loading">Loading…</p></div>

  if (error === 'not-found') {
    return (
      <div className="page center-page">
        <p className="error-msg">Event not found. Check the link and try again.</p>
        <a href="#/" className="btn-link">Back to home</a>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page center-page">
        <p className="error-msg">Something went wrong: {error}</p>
        <a href="#/" className="btn-link">Back to home</a>
      </div>
    )
  }

  async function handleSubmit(name, votes) {
    await submitResponse(id, name, votes)
  }

  return (
    <div className="page event-page">
      <header className="app-header">
        <a href="#/" className="back-link">← New event</a>
        <h1>{event.name}</h1>
      </header>

      <div className="event-body">
        <section className="card respond-section">
          <h2>Mark your availability</h2>
          <RespondForm eventId={id} dates={event.dates} onSubmit={handleSubmit} />
        </section>

        <section className="card summary-section">
          <h2>Group summary</h2>
          <SummaryGrid dates={event.dates} responses={responses} />
          <div className="share-row">
            <span className="share-label">Share link:</span>
            <ShareableLink eventId={id} />
          </div>
        </section>
      </div>
    </div>
  )
}
