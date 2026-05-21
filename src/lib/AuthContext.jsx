import { initProfile } from "@/features/profile/initProfile"

import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  onAuthStateChanged
} from 'firebase/auth'

import {
  doc,
  getDoc
} from 'firebase/firestore'

import {
  auth,
  db
} from './firebase'

const AuthContext =
  createContext(null)

export function AuthProvider({
  children
}) {

  const [user, setUser] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const unsub =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {

          if (!firebaseUser) {

            setUser(null)

            localStorage.removeItem(
              'phx_user'
            )

            setLoading(false)

            return
          }

          const isEmailProvider =
            firebaseUser.providerData.some(
              p => p.providerId === 'password'
            )

          if (
            isEmailProvider &&
            !firebaseUser.emailVerified
          ) {

            await auth.signOut()

            setUser(null)

            localStorage.removeItem(
              'phx_user'
            )

            setLoading(false)

            return
          }

          try {

            await initProfile(
              firebaseUser
            )

            const ref = doc(
              db,
              'profiles',
              firebaseUser.uid
            )

            const snap =
              await getDoc(ref)

            const profile = {
              id: firebaseUser.uid,
              ...snap.data()
            }

            setUser(profile)

            localStorage.setItem(
              'phx_user',
              JSON.stringify(profile)
            )

          } catch (err) {

            console.error(
              'Profile error:',
              err
            )

          }

          setLoading(false)
        }
      )

    return () => unsub()

  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
