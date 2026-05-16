import { useState, useEffect } from 'react'
import {
  collection, doc, addDoc, onSnapshot, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

export async function createEvent(name, dates) {
  const ref = await addDoc(collection(db, 'events'), {
    name,
    dates,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function submitResponse(eventId, name, votes) {
  const cleanVotes = Object.fromEntries(
    Object.entries(votes).filter(([, v]) => v !== null)
  )
  await addDoc(collection(db, 'events', eventId, 'responses'), {
    name,
    votes: cleanVotes,
    createdAt: serverTimestamp(),
  })
}

export function useEvent(eventId) {
  const [event, setEvent] = useState(null)
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!eventId) return
    const eventRef = doc(db, 'events', eventId)
    const unsubEvent = onSnapshot(
      eventRef,
      snap => {
        if (!snap.exists()) {
          setError('not-found')
          setLoading(false)
          return
        }
        setEvent({ id: snap.id, ...snap.data() })
        setLoading(false)
      },
      err => {
        setError(err.message)
        setLoading(false)
      }
    )
    const unsubResponses = onSnapshot(
      collection(db, 'events', eventId, 'responses'),
      snap => setResponses(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
    return () => {
      unsubEvent()
      unsubResponses()
    }
  }, [eventId])

  return { event, responses, loading, error }
}
