import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null)
        localStorage.removeItem('phx_user')
        setLoading(false)
        return
      }

      // Block unverified email/password users
      const isEmailProvider = firebaseUser.providerData.some(
        p => p.providerId === 'password'
      )
      if (isEmailProvider && !firebaseUser.emailVerified) {
        await auth.signOut()
        setUser(null)
        localStorage.removeItem('phx_user')
        setLoading(false)
        return
      }

      try {
        const ref = doc(db, 'profiles', firebaseUser.uid)
        let snap = await getDoc(ref)

        if (!snap.exists()) {
          const pending = JSON.parse(localStorage.getItem('phx_pending_role') || '{}')
          await setDoc(ref, {
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            role: pending.role || 'student',
            phone: firebaseUser.phoneNumber || '',
            photoURL: firebaseUser.photoURL || '',
            provider: firebaseUser.providerData[0]?.providerId || 'unknown',
            created_at: new Date().toISOString()
          })
          localStorage.removeItem('phx_pending_role')
          snap = await getDoc(ref)
        }

        const profile = { id: firebaseUser.uid, ...snap.data() }
        setUser(profile)
        localStorage.setItem('phx_user', JSON.stringify(profile))
      } catch (err) {
        console.error('Profile error:', err)
      }

      setLoading(false)
    })
    return () => unsub()
  }, [])

  const logout = async () => {
    await auth.signOut()
    localStorage.clear()
    window.location.href = '/#/RoleSelect'
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
