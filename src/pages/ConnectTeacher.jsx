import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/lib/AuthContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { Search, UserPlus, GraduationCap, Video, VideoOff, Mic, MicOff, MessageCircle, X, Send, Phone } from 'lucide-react'
import AgoraRTC from 'agora-rtc-sdk-ng'

const AGORA_APP_ID = 'YOUR_AGORA_APP_ID'

function VideoRoom({ roomId, onClose, user }) {
  const clientRef = useRef(null)
  const [localTracks, setLocalTracks] = useState([])
  const [remoteUsers, setRemoteUsers] = useState([])
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(true)
  const [joined, setJoined] = useState(false)
  const localRef = useRef(null)

  useEffect(() => {
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
    clientRef.current = client

    client.on('user-published', async (remoteUser, mediaType) => {
      await client.subscribe(remoteUser, mediaType)
      if (mediaType === 'video') {
        setRemoteUsers(prev => [...prev.filter(u => u.uid !== remoteUser.uid), remoteUser])
        setTimeout(() => remoteUser.videoTrack?.play(`remote-${remoteUser.uid}`), 100)
      }
      if (mediaType === 'audio') remoteUser.audioTrack?.play()
    })

    client.on('user-unpublished', (remoteUser) => {
      setRemoteUsers(prev => prev.filter(u => u.uid !== remoteUser.uid))
    })

    const join = async () => {
      try {
        await client.join(AGORA_APP_ID, roomId, null, null)
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
        setLocalTracks([audioTrack, videoTrack])
        videoTrack.play(localRef.current)
        await client.publish([audioTrack, videoTrack])
        setJoined(true)
      } catch (err) {
        toast.error('Camera/mic access needed for video call')
      }
    }
    join()

    return () => {
      localTracks.forEach(t => { t.stop(); t.close() })
      client.leave()
    }
  }, [roomId])

  const toggleMic = () => {
    localTracks[0]?.setEnabled(!micOn)
    setMicOn(!micOn)
  }

  const toggleCam = () => {
    localTracks[1]?.setEnabled(!camOn)
    setCamOn(!camOn)
  }

  const leave = () => {
    localTracks.forEach(t => { t.stop(); t.close() })
    clientRef.current?.leave()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white font-semibold">Live Class — Room: {roomId.slice(-6)}</span>
        </div>
        <button onClick={leave} className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          <Phone className="w-4 h-4 rotate-[135deg]" /> End Call
        </button>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-auto">
        <div className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video">
          <div ref={localRef} className="w-full h-full" />
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">You</div>
        </div>
        {remoteUsers.map(ru => (
          <div key={ru.uid} className="relative bg-slate-900 rounded-xl overflow-hidden aspect-video">
            <div id={`remote-${ru.uid}`} className="w-full h-full" />
            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Participant</div>
          </div>
        ))}
        {remoteUsers.length === 0 && (
          <div className="bg-slate-900 rounded-xl aspect-video flex items-center justify-center">
            <p className="text-slate-400 text-sm">Waiting for others to join...</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 p-4 border-t border-slate-700">
        <button onClick={toggleMic} className={"w-12 h-12 rounded-full flex items-center justify-center transition-all " + (micOn ? "bg-slate-700 hover:bg-slate-600" : "bg-red-500 hover:bg-red-600")}>
          {micOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
        </button>
        <button onClick={toggleCam} className={"w-12 h-12 rounded-full flex items-center justify-center transition-all " + (camOn ? "bg-slate-700 hover:bg-slate-600" : "bg-red-500 hover:bg-red-600")}>
          {camOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
        </button>
      </div>
    </div>
  )
}

function ChatPanel({ chatId, user, otherName, onClose }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('created_at'))
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    })
    return unsub
  }, [chatId])

  const send = async () => {
    if (!text.trim()) return
    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text, sender: user.email, senderName: user.name || user.email,
      created_at: serverTimestamp()
    })
    setText('')
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-40 flex flex-col" style={{ height: 420 }}>
      <div className="flex items-center justify-between p-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-cyan-400" />
          <span className="text-white font-medium text-sm">{otherName}</span>
        </div>
        <button onClick={onClose}><X className="w-4 h-4 text-slate-400 hover:text-white" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map(m => (
          <div key={m.id} className={"flex " + (m.sender === user.email ? "justify-end" : "justify-start")}>
            <div className={"max-w-[75%] px-3 py-2 rounded-xl text-xs " + (m.sender === user.email ? "bg-cyan-600 text-white" : "bg-slate-700 text-slate-200")}>
              {m.sender !== user.email && <p className="text-cyan-400 font-medium mb-0.5">{m.senderName}</p>}
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 p-3 border-t border-slate-700">
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message..." className="flex-1 bg-slate-800 text-white placeholder-slate-500 rounded-lg px-3 py-2 text-xs outline-none" />
        <button onClick={send} className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded-lg">
          <Send className="w-3 h-3 text-white" />
        </button>
      </div>
    </div>
  )
}

export default function ConnectTeacher() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [videoRoom, setVideoRoom] = useState(null)
  const [chatOpen, setChatOpen] = useState(null)

  const { data: allUsers = [] } = useQuery({
    queryKey: ['all-users-connect'],
    queryFn: async () => {
      const snap = await getDocs(collection(db, 'profiles'))
      return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    }
  })

  const { data: myLinks = [] } = useQuery({
    queryKey: ['my-teacher-links', user?.email],
    queryFn: async () => {
      const field = user?.role === 'teacher' ? 'teacher_email' : 'student_email'
      const q = query(collection(db, 'teacher_student_links'), where(field, '==', user?.email))
      const snap = await getDocs(q)
      return snap.docs.map(d => ({ id: d.id, ...d.data() }))
    },
    enabled: !!user?.email
  })

  const connectMutation = useMutation({
    mutationFn: async (teacher) => {
      await addDoc(collection(db, 'teacher_student_links'), {
        student_email: user.email, student_name: user.name || user.email,
        teacher_email: teacher.email, teacher_name: teacher.name || teacher.email,
        status: 'pending', created_at: new Date().toISOString()
      })
    },
    onSuccess: () => { queryClient.invalidateQueries(['my-teacher-links']); toast.success('Request sent!') }
  })

  const cancelMutation = useMutation({
    mutationFn: async (linkId) => { await deleteDoc(doc(db, 'teacher_student_links', linkId)) },
    onSuccess: () => { queryClient.invalidateQueries(['my-teacher-links']); toast.success('Cancelled.') }
  })

  const approveMutation = useMutation({
    mutationFn: async (linkId) => {
      const { updateDoc } = await import('firebase/firestore')
      await updateDoc(doc(db, 'teacher_student_links', linkId), { status: 'approved' })
    },
    onSuccess: () => { queryClient.invalidateQueries(['my-teacher-links']); toast.success('Student approved!') }
  })

  const teachers = allUsers.filter(u => u.role === 'teacher' && u.email !== user?.email)
  const filtered = teachers.filter(t =>
    (t.name || t.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const getLinkStatus = (email) => {
    const field = user?.role === 'teacher' ? 'student_email' : 'teacher_email'
    return myLinks.find(l => l[field] === email)
  }

  const myConnections = myLinks.filter(l => l.status === 'approved')
  const myPending = myLinks.filter(l => l.status === 'pending')

  const startVideo = (otherEmail) => {
    const roomId = [user.email, otherEmail].sort().join('_').replace(/[@.]/g, '_')
    setVideoRoom(roomId)
  }

  const openChat = (link) => {
    const chatId = [link.student_email, link.teacher_email].sort().join('_').replace(/[@.]/g, '_')
    const otherName = user.role === 'teacher' ? link.student_name : link.teacher_name
    setChatOpen({ chatId, otherName })
  }

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
      {videoRoom && <VideoRoom roomId={videoRoom} onClose={() => setVideoRoom(null)} user={user} />}
      {chatOpen && <ChatPanel chatId={chatOpen.chatId} user={user} otherName={chatOpen.otherName} onClose={() => setChatOpen(null)} />}

      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-1">Connect with {user.role === 'teacher' ? 'Students' : 'Teachers'}</h1>
        <p className="text-slate-400 mb-6">Video call and chat with your {user.role === 'teacher' ? 'students' : 'teachers'} directly.</p>

        {myConnections.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">✅ My Connections</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myConnections.map(link => {
                const otherName = user.role === 'teacher' ? link.student_name : link.teacher_name
                const otherEmail = user.role === 'teacher' ? link.student_email : link.teacher_email
                return (
                  <div key={link.id} className="bg-slate-900 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-bold">
                        {otherName?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{otherName}</p>
                        <p className="text-slate-400 text-xs">{otherEmail}</p>
                      </div>
                      <span className="text-green-400 text-xs font-medium">Connected</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => startVideo(otherEmail)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs hover:bg-blue-500/20 transition-colors">
                        <Video className="w-3 h-3" /> Video Call
                      </button>
                      <button onClick={() => openChat(link)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs hover:bg-cyan-500/20 transition-colors">
                        <MessageCircle className="w-3 h-3" /> Chat
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {myPending.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3">⏳ Pending Requests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myPending.map(link => (
                <div key={link.id} className="bg-slate-900 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{user.role === 'teacher' ? link.student_name : link.teacher_name}</p>
                    <p className="text-slate-400 text-xs">{user.role === 'teacher' ? link.student_email : link.teacher_email}</p>
                  </div>
                  <div className="flex gap-2">
                    {user.role === 'teacher' && (
                      <button onClick={() => approveMutation.mutate(link.id)} className="text-green-400 text-xs hover:text-green-300 border border-green-500/30 px-3 py-1.5 rounded-lg">Approve</button>
                    )}
                    <button onClick={() => cancelMutation.mutate(link.id)} className="text-red-400 text-xs hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg">
                      {user.role === 'teacher' ? 'Reject' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {user.role === 'student' && (
          <>
            <div className="bg-slate-800 rounded-lg px-4 py-2 flex items-center gap-2 mb-4">
              <Search className="w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..."
                className="bg-transparent text-white placeholder-slate-500 outline-none flex-1 text-sm" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-3">All Teachers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.length === 0 ? (
                <p className="text-slate-400 col-span-2">No teachers found.</p>
              ) : filtered.map(teacher => {
                const link = getLinkStatus(teacher.email)
                return (
                  <div key={teacher.id} className="bg-slate-900 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
                        {(teacher.name || teacher.email)?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium">{teacher.name || teacher.email}</p>
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
          </>
        )}
      </div>
    </div>
  )
}
