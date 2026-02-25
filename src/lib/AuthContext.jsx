import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from './firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('phx_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profileDoc = await getDoc(doc(db, 'profiles', firebaseUser.uid))
        const profile = profileDoc.data()
        const u = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          full_name: profile?.name || firebaseUser.email,
          role: profile?.role || 'student'
        }
        localStorage.setItem('phx_user', JSON.stringify(u))
        setUser(u)
      } else {
        localStorage.removeItem('phx_user')
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  const login = (userData) => {
    localStorage.setItem('phx_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = async () => {
    await signOut(auth)
    localStorage.removeItem('phx_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
