import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const app = initializeApp({
  apiKey:            "AIzaSyDUkT0a9PYIjuXzjiwf3SO4OF7g0Kk9EOg",
  authDomain:        "spyders-76398.firebaseapp.com",
  projectId:         "spyders-76398",
  storageBucket:     "spyders-76398.firebasestorage.app",
  messagingSenderId: "529800092224",
  appId:             "1:529800092224:web:f976dd1ee865233c431da5",
})

export const db = getFirestore(app)
