import { db, auth } from '@/lib/firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from 'firebase/firestore'
import { useAuth } from '@/lib/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Search, UserPlus, UserCheck, UserX, GraduationCap } from 'lucide-react'

export default function ConnectTeacher() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')

  const { data: allUsers = [] } = useQuery({
    queryKey: ['all-users-connect'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'profiles'))
      return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    },
    enabled: true
  })

  const { data: myLinks = [] } = useQuery({
    queryKey: ['my-teacher-links', user?.email],
    queryFn: async () => {
      const q = query(collection(db, 'teacher_student_links'), where('student_email', '==', user?.email))
      const snap = await getDocs(q)
      return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    },
    enabled: !!user?.email
  })

  const connectMutation = useMutation({
    mutationFn: async (teacher) => {
      await addDoc(collection(db, 'teacher_student_links'), {
        student_email: user.email,
        student_name: user.full_name || user.email,
        teacher_email: teacher.email,
        teacher_name: teacher.full_name || teacher.email,
        status: 'pending',
        created_at: new Date().toISOString()
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-teacher-links'])
      toast.success('Request sent! Waiting for teacher approval.')
    }
  })

  const cancelMutation = useMutation({
    mutationFn: async (linkId) => {
      await deleteDoc(doc(db, 'teacher_student_links', linkId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['my-teacher-links'])
      toast.success('Request cancelled.')
    }
  })

  const teachers = allUsers.filter(u => (u.role === 'teacher' || u.role === 'admin') && u.email !== user?.email)
  const filtered = teachers.filter(t =>
    (t.full_name || t.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const getLinkStatus = (teacherEmail) => myLinks.find(l => l.teacher_email === teacherEmail)
  const myConnections = myLinks.filter(l => l.status === 'approved')
  const myPending = myLinks.filter(l => l.status === 'pending')

  if (!user) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <p className="text-white mb-4">Please sign in first.</p>
        <a href="/#/RoleSelect" className="bg-cyan-500 text-white px-6 py-2 rounded-lg">Sign In</a>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">Connect with Teachers</h1>
        <p className="text-slate-400 mb-6">Find and link with your teachers. Once connected, you will receive assignment notifications automatically.</p>

        {myConnections.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">My Connections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myConnections.map(link => (
                <div key={link.id} className="bg-slate-900 border border-green-500/30 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{link.teacher_name}</p>
                      <p className="text-slate-400 text-sm">{link.teacher_email}</p>
                    </div>
                  </div>
                  <span className="text-green-400 text-sm font-medium">Connected</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {myPending.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">Pending Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myPending.map(link => (
                <div key={link.id} className="bg-slate-900 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{link.teacher_name}</p>
                    <p className="text-slate-400 text-sm">{link.teacher_email}</p>
                  </div>
                  <button onClick={() => cancelMutation.mutate(link.id)} className="text-red-400 text-sm hover:text-red-300">Cancel</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..."
            className="bg-transparent text-white placeholder-slate-500 outline-none flex-1 text-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <p className="text-slate-400 col-span-2">No teachers found. Ask your teacher to register on PHX-MASTER.</p>
          ) : filtered.map(teacher => {
            const link = getLinkStatus(teacher.email)
            return (
              <div key={teacher.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                    {(teacher.full_name || teacher.name || teacher.email)?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{teacher.full_name || teacher.name || teacher.email}</p>
                    <p className="text-slate-400 text-sm">{teacher.email}</p>
                  </div>
                </div>
                {link ? (
                  <span className={"text-sm font-medium " + (link.status === 'approved' ? 'text-green-400' : 'text-yellow-400')}>
                    {link.status === 'approved' ? 'Connected' : 'Pending'}
                  </span>
                ) : (
                  <button onClick={() => connectMutation.mutate(teacher)}
                    className="flex items-center gap-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded-lg text-sm hover:bg-cyan-500/20">
                    <UserPlus className="w-3 h-3" /> Connect
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
