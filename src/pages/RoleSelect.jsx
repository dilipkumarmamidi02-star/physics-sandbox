import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';

export default function RoleSelect() {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');

  const handleSignIn = () => {
    if (!email) return alert('Please enter your email');
    login({ name, email, role });
    window.location.href = '/#/';
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-white mb-2 text-center">Welcome</h1>
        <p className="text-slate-400 text-center mb-8">Sign in to Physics Sandbox</p>

        <div className="space-y-4">
          <div>
            <label className="text-slate-300 text-sm mb-1 block">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm mb-1 block">Role</label>
            <div className="flex gap-3">
              <button
                onClick={() => setRole('student')}
                className={`flex-1 py-2 rounded-lg border transition-all ${role === 'student' ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-slate-600 text-slate-400'}`}
              >
                Student
              </button>
              <button
                onClick={() => setRole('teacher')}
                className={`flex-1 py-2 rounded-lg border transition-all ${role === 'teacher' ? 'border-purple-500 bg-purple-500/10 text-purple-400' : 'border-slate-600 text-slate-400'}`}
              >
                Teacher
              </button>
            </div>
          </div>
          <button
            onClick={handleSignIn}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity mt-2"
          >
            Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
}
