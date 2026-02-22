import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('phx_user')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        const u = { id: session.user.id, email: session.user.email, full_name: profile?.name || session.user.email, role: profile?.role || 'student' }
        localStorage.setItem('phx_user', JSON.stringify(u))
        setUser(u)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        const u = { id: session.user.id, email: session.user.email, full_name: profile?.name || session.user.email, role: profile?.role || 'student' }
        localStorage.setItem('phx_user', JSON.stringify(u))
        setUser(u)
      } else {
        localStorage.removeItem('phx_user')
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = (userData) => {
    localStorage.setItem('phx_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = async () => {
    await supabase.auth.signOut()
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
