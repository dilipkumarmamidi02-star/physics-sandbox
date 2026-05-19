import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Flame, Clock, CheckCircle, XCircle, ChevronRight, Medal, Star, RotateCcw } from 'lucide-react'

const BANK_MAP = { 'Class 11': 'class11', 'Class 12': 'class12', 'B.Tech': 'btech' }

function getDayIndex() {
  const start = new Date('2025-01-01')
  const now = new Date()
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24))
  return diff % 365
}

function getTodayStr() {
  return new Date().toISOString().slice(0, 10)
}

export default function Quiz() {
  const { user } = useAuth()
  const [bank, setBank] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [phase, setPhase] = useState('loading') // loading | already_done | quiz | result
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [leaderboard, setLeaderboard] = useState([])
  const [todayRecord, setTodayRecord] = useState(null)
  const classLevel = user?.classLevel || 'Class 11'

  // Load quiz bank dynamically
  useEffect(() => {
    if (!user) return
    const key = BANK_MAP[classLevel] || 'class11'
    import(`../data/quizBank${key === 'class11' ? '11' : key === 'class12' ? '12' : 'Btech'}.js`)
      .then(mod => {
        const allQ = mod[`QUIZ_BANK_${key === 'class11' ? '11' : key === 'class12' ? '12' : 'BTECH'}`] || mod.default || []
        const dayIdx = getDayIndex()
        const start = (dayIdx * 10) % Math.max(allQ.length - 9, 1)
        setBank(allQ)
        setQuestions(allQ.slice(start, start + 10))
      })
      .catch(() => {
        // fallback empty
        setBank([])
        setQuestions([])
      })
  }, [user, classLevel])

  // Check if already attempted today
  useEffect(() => {
    if (!user || questions.length === 0) return
    const check = async () => {
      const ref = doc(db, 'quiz_attempts', `${user.email}_${getTodayStr()}`)
      const snap = await getDoc(ref)
      if (snap.exists()) {
        setTodayRecord(snap.data())
        setPhase('already_done')
      } else {
        setPhase('quiz')
        setStreak(user.streak || 0)
      }
    }
    check()
  }, [user, questions])

  // Timer
  useEffect(() => {
    if (phase !== 'quiz' || selected !== null) return
    if (timeLeft <= 0) { handleSelect(-1); return }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000)
    return () => clearTimeout(t)
  }, [phase, timeLeft, selected])

  const handleSelect = useCallback((idx) => {
    if (selected !== null) return
    setSelected(idx)
    const correct = idx === questions[current].ans
    setAnswers(prev => [...prev, { selected: idx, correct, question: questions[current] }])
    if (correct) setScore(p => p + 10)
  }, [selected, questions, current])

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      finishQuiz()
    } else {
      setCurrent(p => p + 1)
      setSelected(null)
      setTimeLeft(30)
    }
  }

  const finishQuiz = async () => {
    setPhase('result')
    const finalScore = answers.filter(a => a.correct).length * 10 + (selected === questions[current]?.ans ? 10 : 0)
    const today = getTodayStr()
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const lastQuiz = user.lastQuizDate
    const newStreak = lastQuiz === yesterday ? (user.streak || 0) + 1 : lastQuiz === today ? (user.streak || 0) : 1

    // Save attempt
    await setDoc(doc(db, 'quiz_attempts', `${user.email}_${today}`), {
      email: user.email,
      name: user.name || user.email,
      classLevel,
      score: finalScore,
      totalQ: questions.length,
      correct: answers.filter(a => a.correct).length,
      date: today,
      dayIndex: getDayIndex(),
      answers: answers.map(a => ({ q: a.question.id, sel: a.selected, correct: a.correct }))
    })

    // Update profile
    await updateDoc(doc(db, 'profiles', user.id), {
      streak: newStreak,
      lastQuizDate: today,
      totalScore: (user.totalScore || 0) + finalScore,
      quizzesAttempted: (user.quizzesAttempted || 0) + 1
    })

    setStreak(newStreak)
    loadLeaderboard()
  }

  const loadLeaderboard = async () => {
    const today = getTodayStr()
    const snap = await getDocs(collection(db, 'quiz_attempts'))
    const todayAttempts = snap.docs
      .map(d => d.data())
      .filter(d => d.date === today && d.classLevel === classLevel)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
    setLeaderboard(todayAttempts)
  }

  useEffect(() => { if (phase === 'already_done') loadLeaderboard() }, [phase])

  if (!user) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <p className="text-white">Please sign in to take the quiz.</p>
    </div>
  )

  if (phase === 'loading') return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white">Loading today's quiz...</p>
      </div>
    </div>
  )

  if (phase === 'already_done') return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-cyan-400 mb-2">Today's Quiz Done!</h1>
          <p className="text-slate-400">Come back tomorrow for 10 new questions.</p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{todayRecord?.score || 0}</div>
              <div className="text-xs text-slate-400">Today's Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 flex items-center gap-1"><Flame className="w-7 h-7" />{user.streak || 0}</div>
              <div className="text-xs text-slate-400">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">{todayRecord?.correct || 0}/10</div>
              <div className="text-xs text-slate-400">Correct</div>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400" /> Today's Leaderboard — {classLevel}</h2>
        <div className="space-y-2">
          {leaderboard.map((entry, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${entry.email === user.email ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-slate-700 bg-slate-900'}`}>
              <span className="text-xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</span>
              <div className="flex-1">
                <p className="text-white font-medium text-sm">{entry.name}</p>
                <p className="text-slate-400 text-xs">{entry.correct}/10 correct</p>
              </div>
              <span className="text-cyan-400 font-bold">{entry.score} pts</span>
            </div>
          ))}
          {leaderboard.length === 0 && <p className="text-slate-400 text-sm text-center py-4">No attempts yet today.</p>}
        </div>
      </div>
    </div>
  )

  if (phase === 'quiz') {
    const q = questions[current]
    if (!q) return null
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-bold text-cyan-400">Daily Quiz</h1>
              <p className="text-slate-400 text-xs">{classLevel} • Question {current + 1}/10</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-orange-400">
                <Flame className="w-4 h-4" />
                <span className="font-bold">{streak}</span>
              </div>
              <div className={`flex items-center gap-1 font-bold ${timeLeft <= 10 ? 'text-red-400' : 'text-cyan-400'}`}>
                <Clock className="w-4 h-4" />
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full bg-slate-800 rounded-full h-2 mb-6">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all" style={{ width: `${((current) / 10) * 100}%` }} />
          </div>

          {/* Score */}
          <div className="text-right text-sm text-slate-400 mb-4">Score: <span className="text-cyan-400 font-bold">{score}</span></div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl p-6 mb-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full">{q.topic}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${q.diff === 'easy' ? 'bg-green-500/20 text-green-400' : q.diff === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{q.diff}</span>
              </div>
              <p className="text-white text-lg font-semibold mb-6">{q.q}</p>
              <div className="space-y-3">
                {q.opts.map((opt, i) => {
                  let style = 'border-slate-600 bg-slate-800 hover:border-cyan-500/50 hover:bg-slate-700'
                  if (selected !== null) {
                    if (i === q.ans) style = 'border-green-500 bg-green-500/20'
                    else if (i === selected && selected !== q.ans) style = 'border-red-500 bg-red-500/20'
                    else style = 'border-slate-700 bg-slate-800/50 opacity-60'
                  }
                  return (
                    <button key={i} onClick={() => handleSelect(i)} disabled={selected !== null}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium ${style} ${selected === null ? 'cursor-pointer' : 'cursor-default'}`}>
                      <span className="text-slate-400 mr-3">{String.fromCharCode(65+i)}.</span>{opt}
                      {selected !== null && i === q.ans && <CheckCircle className="inline w-4 h-4 text-green-400 ml-2" />}
                      {selected !== null && i === selected && selected !== q.ans && <XCircle className="inline w-4 h-4 text-red-400 ml-2" />}
                    </button>
                  )
                })}
              </div>
              {selected !== null && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-lg text-sm ${selected === q.ans ? 'bg-green-500/10 border border-green-500/30 text-green-300' : 'bg-red-500/10 border border-red-500/30 text-red-300'}`}>
                  💡 {q.exp}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {selected !== null && (
            <button onClick={handleNext}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-white flex items-center justify-center gap-2">
              {current + 1 >= questions.length ? '🏁 See Results' : 'Next Question'} <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    )
  }

  if (phase === 'result') {
    const correct = answers.filter(a => a.correct).length
    const pct = Math.round((correct / questions.length) * 100)
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center mb-8">
            <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
            <h1 className="text-3xl font-bold mb-2">{pct >= 80 ? 'Excellent!' : pct >= 50 ? 'Good Job!' : 'Keep Practicing!'}</h1>
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400">{score}</div>
                <div className="text-xs text-slate-400">Points</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400">{correct}/10</div>
                <div className="text-xs text-slate-400">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-400 flex items-center gap-1"><Flame className="w-8 h-8" />{streak}</div>
                <div className="text-xs text-slate-400">Day Streak</div>
              </div>
            </div>
          </motion.div>

          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-400" /> Today's Leaderboard — {classLevel}</h2>
          <div className="space-y-2 mb-6">
            {leaderboard.map((entry, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${entry.email === user.email ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-slate-700 bg-slate-900'}`}>
                <span className="text-xl">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}</span>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{entry.name}</p>
                  <p className="text-slate-400 text-xs">{entry.correct}/10 correct</p>
                </div>
                <span className="text-cyan-400 font-bold">{entry.score} pts</span>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold mb-4">📝 Review Answers</h2>
          <div className="space-y-3">
            {answers.map((a, i) => (
              <div key={i} className={`p-4 rounded-xl border ${a.correct ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                <p className="text-white text-sm font-medium mb-2">Q{i+1}: {a.question.q}</p>
                <p className={`text-xs ${a.correct ? 'text-green-400' : 'text-red-400'}`}>
                  {a.correct ? '✅' : '❌'} Your answer: {a.selected >= 0 ? a.question.opts[a.selected] : 'Time up'}
                </p>
                {!a.correct && <p className="text-xs text-green-400">✅ Correct: {a.question.opts[a.question.ans]}</p>}
                <p className="text-xs text-slate-400 mt-1">💡 {a.question.exp}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}
