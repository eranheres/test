import { useEvent, submitResponse } from '../hooks/useEvent.js'
import RespondForm from '../components/RespondForm.jsx'
import WindowSummary from '../components/WindowSummary.jsx'
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
        <p className="subtitle">
          {event.duration}-day trip · mark the days you can't make it
        </p>
      </header>

      <div className="how-it-works">
        <div className="hiw-step"><span className="hiw-num">1</span> Enter your name below</div>
        <div className="hiw-step"><span className="hiw-num">2</span> Tap days on the calendar to mark when you can't join or prefer not to</div>
        <div className="hiw-step"><span className="hiw-num">3</span> Hit save — the app finds the best {event.duration}-day window for the whole group</div>
      </div>

      <div className="event-body">
        <section className="card respond-section">
          <h2>Mark your availability</h2>
          <RespondForm
            eventId={id}
            startDate={event.startDate}
            endDate={event.endDate}
            onSubmit={handleSubmit}
          />
        </section>

        <section className="card summary-section">
          <h2>Best {event.duration}-day windows</h2>
          <WindowSummary
            startDate={event.startDate}
            endDate={event.endDate}
            duration={event.duration}
            responses={responses}
          />
          <div className="share-row">
            <span className="share-label">Share link:</span>
            <ShareableLink eventId={id} />
          </div>
        </section>
      </div>
    </div>
  )
}
