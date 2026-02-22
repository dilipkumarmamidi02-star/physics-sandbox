import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function RoleSelect() {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) return setError('Please fill all fields');
    if (mode === 'signup' && !name) return setError('Please enter your name');
    setLoading(true);
    setError('');
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) { setError(signUpError.message); setLoading(false); return; }
        await supabase.from('profiles').insert({ id: data.user.id, email, name, role });
        login({ id: data.user.id, email, full_name: name, role });
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) { setError(signInError.message); setLoading(false); return; }
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
        login({ id: data.user.id, email, full_name: profile?.name || email, role: profile?.role || 'student' });
      }
      window.location.href = '/#/';
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white mb-2 text-center">⚛️ PHX Physics</h1>
        <p className="text-slate-400 text-center mb-6">Virtual Physics Laboratory</p>

        <div className="flex mb-6 bg-slate-800 rounded-lg p-1">
          <button onClick={() => setMode('login')} className={"flex-1 py-2 rounded-md text-sm font-medium transition-all " + (mode === "login" ? "bg-cyan-500 text-white" : "text-slate-400")}>Sign In</button>
          <button onClick={() => setMode('signup')} className={"flex-1 py-2 rounded-md text-sm font-medium transition-all " + (mode === "signup" ? "bg-cyan-500 text-white" : "text-slate-400")}>Sign Up</button>
        </div>

        <div className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-slate-300 text-sm mb-1 block">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" />
            </div>
          )}
          <div>
            <label className="text-slate-300 text-sm mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <label className="text-slate-300 text-sm mb-1 block">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" />
          </div>
          {mode === 'signup' && (
            <div>
              <label className="text-slate-300 text-sm mb-1 block">Role</label>
              <div className="flex gap-3">
                <button onClick={() => setRole('student')} className={"flex-1 py-2 rounded-lg border transition-all " + (role === "student" ? "border-cyan-500 bg-cyan-500/10 text-cyan-400" : "border-slate-600 text-slate-400")}>Student</button>
                <button onClick={() => setRole('teacher')} className={"flex-1 py-2 rounded-lg border transition-all " + (role === "teacher" ? "border-purple-500 bg-purple-500/10 text-purple-400" : "border-slate-600 text-slate-400")}>Teacher</button>
              </div>
            </div>
          )}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
