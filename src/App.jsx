import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage.jsx'
import EventPage from './pages/EventPage.jsx'

function parseHash(hash) {
  const clean = hash.replace(/^#\/?/, '')
  const match = clean.match(/^event\/([a-zA-Z0-9]+)$/)
  if (match) return { page: 'event', id: match[1] }
  return { page: 'home' }
}

export default function App() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash))

  useEffect(() => {
    const handler = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (route.page === 'event') return <EventPage id={route.id} />
  return <HomePage />
}
