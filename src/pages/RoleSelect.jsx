import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db, googleProvider, githubProvider } from '../lib/firebase'

export default function RoleSelect() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [role, setRole] = useState('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [confirmResult, setConfirmResult] = useState(null)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const clearMessages = () => { setError(''); setInfo('') }

  const handleEmailAuth = async (e) => {
    e.preventDefault(); clearMessages(); setLoading(true)
    try {
      if (mode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(cred.user, { displayName: name })
        await setDoc(doc(db, 'profiles', cred.user.uid), { email, name, role, phone: '', photoURL: '', provider: 'password', created_at: new Date().toISOString() })
        await sendEmailVerification(cred.user)
        await auth.signOut()
        setInfo('✅ Verification email sent! Check your inbox, verify, then sign in.')
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        navigate('/')
      }
    } catch (err) { setError(friendlyError(err.code)) }
    setLoading(false)
  }

  const handleGoogle = async () => {
    clearMessages(); setLoading(true)
    try {
      localStorage.setItem('phx_pending_role', JSON.stringify({ role }))
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (err) { setError(friendlyError(err.code)) }
    setLoading(false)
  }

  const handleGithub = async () => {
    clearMessages(); setLoading(true)
    try {
      localStorage.setItem('phx_pending_role', JSON.stringify({ role }))
      await signInWithPopup(auth, githubProvider)
      navigate('/')
    } catch (err) { setError(friendlyError(err.code)) }
    setLoading(false)
  }

  const sendOTP = async (e) => {
    e.preventDefault(); clearMessages(); setLoading(true)
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible', callback: () => {} })
      }
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
      setConfirmResult(result); setOtpSent(true); setInfo('OTP sent to ' + phone)
    } catch (err) { setError(friendlyError(err.code)); window.recaptchaVerifier = null }
    setLoading(false)
  }

  const verifyOTP = async (e) => {
    e.preventDefault(); clearMessages(); setLoading(true)
    try {
      localStorage.setItem('phx_pending_role', JSON.stringify({ role }))
      await confirmResult.confirm(otp); navigate('/')
    } catch (err) { setError('Invalid OTP. Please try again.') }
    setLoading(false)
  }

  const friendlyError = (code) => ({
    'auth/email-already-in-use': 'This email is already registered. Please sign in.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Incorrect email or password.',
    'auth/user-not-found': 'No account found. Please sign up.',
    'auth/invalid-email': 'Invalid email address.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed. Try again.',
    'auth/invalid-phone-number': 'Invalid phone number. Use format: +91XXXXXXXXXX',
    'auth/too-many-requests': 'Too many attempts. Please wait a few minutes.',
    'auth/account-exists-with-different-credential': 'Account exists with a different sign-in method.',
  }[code] || 'Something went wrong. Please try again.')

  const inp = { width:'100%', padding:'10px 14px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:'#f1f5f9', fontSize:14, marginBottom:10, outline:'none', boxSizing:'border-box' }
  const primaryBtn = { width:'100%', padding:'11px', background:'#0891b2', border:'none', borderRadius:8, color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', marginTop:4 }
  const oauthBtn = (bg) => ({ width:'100%', padding:'10px', background:bg, border:'none', borderRadius:8, color:'#fff', fontWeight:600, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:10 })

  return (
    <div style={{ minHeight:'100vh', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ width:'100%', maxWidth:440, background:'#1e293b', borderRadius:16, padding:'2rem', border:'1px solid #334155' }}>
        <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
          <div style={{ fontSize:36, marginBottom:8 }}>⚛️</div>
          <h1 style={{ color:'#06b6d4', fontSize:22, fontWeight:700, margin:0 }}>PHX-MASTER</h1>
          <p style={{ color:'#94a3b8', fontSize:13, margin:'4px 0 0' }}>Virtual Physics Laboratory</p>
        </div>
        <div style={{ display:'flex', background:'#0f172a', borderRadius:8, padding:4, marginBottom:'1.5rem' }}>
          {['student','teacher'].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{ flex:1, padding:'8px', borderRadius:6, border:'none', cursor:'pointer', fontWeight:600, fontSize:13, background:role===r?'#06b6d4':'transparent', color:role===r?'#fff':'#94a3b8' }}>
              {r==='student'?'🎓 Student':'👨‍🏫 Teacher'}
            </button>
          ))}
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:'1.5rem' }}>
          {['login','signup','phone'].map(m => (
            <button key={m} onClick={() => { setMode(m); clearMessages() }} style={{ flex:1, padding:'7px', borderRadius:6, cursor:'pointer', fontSize:12, fontWeight:600, border:`1px solid ${mode===m?'#06b6d4':'#334155'}`, background:mode===m?'#164e63':'transparent', color:mode===m?'#06b6d4':'#64748b' }}>
              {m==='login'?'🔑 Login':m==='signup'?'📝 Sign Up':'📱 Phone'}
            </button>
          ))}
        </div>
        {error && <div style={{ background:'#450a0a', border:'1px solid #ef4444', borderRadius:8, padding:'10px 14px', color:'#fca5a5', fontSize:13, marginBottom:12 }}>{error}</div>}
        {info && <div style={{ background:'#052e16', border:'1px solid #22c55e', borderRadius:8, padding:'10px 14px', color:'#86efac', fontSize:13, marginBottom:12 }}>{info}</div>}
        {(mode==='login'||mode==='signup') && (
          <form onSubmit={handleEmailAuth}>
            {mode==='signup' && <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name" required style={inp}/>}
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" required style={inp}/>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (min 6 chars)" required style={inp}/>
            <button type="submit" disabled={loading} style={primaryBtn}>{loading?'⏳ Please wait...':mode==='login'?'🔑 Sign In':'📝 Create Account'}</button>
            {mode==='signup' && <p style={{ color:'#94a3b8', fontSize:11, marginTop:6, textAlign:'center' }}>A verification email will be sent. You must verify before logging in.</p>}
          </form>
        )}
        {mode==='phone' && (
          <form onSubmit={otpSent?verifyOTP:sendOTP}>
            {!otpSent
              ? <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone: +91XXXXXXXXXX" required style={inp}/>
              : <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Enter 6-digit OTP" required style={inp} maxLength={6}/>
            }
            <div id="recaptcha-container"></div>
            <button type="submit" disabled={loading} style={primaryBtn}>{loading?'⏳ Please wait...':otpSent?'✅ Verify OTP':'📲 Send OTP'}</button>
            {otpSent && <button type="button" onClick={() => { setOtpSent(false); setOtp(''); window.recaptchaVerifier=null }} style={{ ...primaryBtn, background:'transparent', border:'1px solid #334155', color:'#94a3b8', marginTop:6 }}>← Change Number</button>}
          </form>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:10, margin:'1.2rem 0' }}>
          <div style={{ flex:1, height:1, background:'#334155' }}/>
          <span style={{ color:'#64748b', fontSize:12 }}>or continue with</span>
          <div style={{ flex:1, height:1, background:'#334155' }}/>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <button onClick={handleGoogle} disabled={loading} style={oauthBtn('#4285F4')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Sign in with Google
          </button>
          <button onClick={handleGithub} disabled={loading} style={oauthBtn('#24292e')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            Sign in with GitHub
          </button>
        </div>
        <p style={{ textAlign:'center', color:'#64748b', fontSize:12, marginTop:'1.2rem' }}>
          {mode==='login'?"Don't have an account? ":"Already have an account? "}
          <span onClick={() => { setMode(mode==='login'?'signup':'login'); clearMessages() }} style={{ color:'#06b6d4', cursor:'pointer', fontWeight:600 }}>
            {mode==='login'?'Sign Up':'Sign In'}
          </span>
        </p>
      </div>
    </div>
  )
}
