import { useAuth } from '@/lib/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">Please sign in to view your profile.</p>
          <button onClick={() => navigate('/RoleSelect')} className="bg-cyan-500 text-white px-6 py-2 rounded-lg">Sign In</button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    await updateDoc(doc(db, 'profiles', user.id), { name });
    const updated = { ...user, full_name: name };
    localStorage.setItem('phx_user', JSON.stringify(updated));
    setMsg('Profile updated!');
    setSaving(false);
    setTimeout(() => setMsg(''), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/RoleSelect');
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-md mx-auto mt-10">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white">
              {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{user.full_name}</h1>
              <p className="text-slate-400 text-sm">{user.email}</p>
              <span className={"text-xs px-2 py-0.5 rounded-full " + (user.role === 'teacher' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400')}>
                {user.role === 'teacher' ? 'Teacher' : 'Student'}
              </span>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-slate-300 text-sm mb-1 block">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500" />
            </div>
            <div>
              <label className="text-slate-300 text-sm mb-1 block">Email</label>
              <input type="email" value={user.email} disabled
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed" />
            </div>
          </div>

          {msg && <p className="text-green-400 text-sm mb-3">{msg}</p>}

          <button onClick={handleSave} disabled={saving}
            className="w-full py-2 bg-cyan-500 text-white rounded-lg mb-3 hover:bg-cyan-400 transition-colors disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button onClick={handleLogout}
            className="w-full py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
