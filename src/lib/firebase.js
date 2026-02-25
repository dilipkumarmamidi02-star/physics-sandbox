import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDKQSeJdy_AUmjM-WcTPdym-jNm6zGSM7w",
  authDomain: "phx-master.firebaseapp.com",
  projectId: "phx-master",
  storageBucket: "phx-master.firebasestorage.app",
  messagingSenderId: "110693167968",
  appId: "1:110693167968:web:33cddded837a62b8fae405"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
