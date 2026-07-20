import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setPrediction, clearChat, setCurrentSessionId, loadSession } from '../store/chatSlice'
import Navbar from '../components/Navbar'

const API_URL = import.meta.env.VITE_API_URL

const CAREERS = {
  0: "Applications Developer",
  1: "CRM Technical Developer",
  2: "Database Developer",
  3: "Mobile Applications Developer",
  4: "Network Security Engineer",
  5: "Software Developer",
  6: "Software Engineer",
  7: "Software Quality Assurance (QA) / Testing",
  8: "Systems Security Administrator",
  9: "Technical Support",
  10: "UX Designer",
  11: "Web Developer",
}

// ── localStorage helpers ──────────────────────────────────────────────────────
const LS_KEY = 'careersense_chat_history'

function getAllSessions() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') }
  catch { return [] }
}

function saveSession(sessionId, messages, prediction, probability, userName) {
  const sessions = getAllSessions().filter(s => s.sessionId !== sessionId)
  const firstUserMsg = messages.find(m => m.role === 'user')
  const title = firstUserMsg
    ? firstUserMsg.content.slice(0, 48) + (firstUserMsg.content.length > 48 ? '…' : '')
    : 'New Chat'
  sessions.unshift({ sessionId, title, messages, prediction, probability, userName, savedAt: Date.now() })
  // keep only latest 30
  localStorage.setItem(LS_KEY, JSON.stringify(sessions.slice(0, 30)))
}

function deleteSession(sessionId) {
  const sessions = getAllSessions().filter(s => s.sessionId !== sessionId)
  localStorage.setItem(LS_KEY, JSON.stringify(sessions))
}

function formatDate(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Chat() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { messages, prediction, probability, currentSessionId } = useSelector(s => s.chat)
  const { isLoggedIn, userName } = useSelector(s => s.auth)

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sessions, setSessions] = useState([])
  const [sessionId, setSessionId] = useState(
    () => currentSessionId || Math.random().toString(36).substr(2, 9)
  )

  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const greetingAdded = useRef(false)

  // refresh sessions list whenever sidebar opens
  useEffect(() => {
    if (sidebarOpen) setSessions(getAllSessions())
  }, [sidebarOpen])

  useEffect(() => {
    if (!isLoggedIn) { navigate('/signin'); return }
    if (messages.length === 0 && !greetingAdded.current) {
      greetingAdded.current = true
      dispatch(addMessage({
        role: 'assistant',
        content: `Hi ${userName}! I'm your CareerSense AI Advisor.\n\nI'm here to help you discover your perfect IT career path through a simple conversation.\n\n**What subjects or topics in IT do you enjoy the most?** For example: coding, design, networks, security, databases...`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // auto-save after every new message
  useEffect(() => {
    if (messages.length > 1) {
      saveSession(sessionId, messages, prediction, probability, userName)
    }
  }, [messages, prediction, probability])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = {
      role: 'user', content: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    dispatch(addMessage(userMsg))
    const currentInput = input
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/chat/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          session_id: sessionId,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      })
      const data = await res.json()
      dispatch(addMessage({
        role: 'assistant', content: data.response || "Based on our conversation, here's your predicted IT career path!",
        prediction: data.prediction, probability: data.probability,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
      if (data.prediction !== undefined && data.prediction !== null) {
        dispatch(setPrediction({ prediction: data.prediction, probability: data.probability }))
      }
    } catch {
      dispatch(addMessage({
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
    }
    setLoading(false)
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const handleInput = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  const handleNewChat = () => {
    const newId = Math.random().toString(36).substr(2, 9)
    setSessionId(newId)
    dispatch(clearChat())
    dispatch(setCurrentSessionId(newId))
    setSidebarOpen(false)
    greetingAdded.current = false
    setTimeout(() => {
      greetingAdded.current = true
      dispatch(addMessage({
        role: 'assistant',
        content: `Hi ${userName}! Ready for a fresh start?\n\n**What IT topics interest you the most?**`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
    }, 100)
  }

  const handleLoadSession = (session) => {
    setSessionId(session.sessionId)
    dispatch(loadSession(session))
    setSidebarOpen(false)
  }

  const handleDeleteSession = (e, sid) => {
    e.stopPropagation()
    deleteSession(sid)
    setSessions(getAllSessions())
    if (sid === sessionId) handleNewChat()
  }

  const stripJson = (text) => {
    if (!text) return ''
    const marker = '"ready_to_predict"'
    const idx = text.indexOf(marker)
    if (idx === -1) return text

    // Walk backwards to find the opening brace
    let start = idx
    while (start > 0 && text[start] !== '{') start--

    // Walk forward counting braces to find the closing brace
    let depth = 0, end = start
    for (let i = start; i < text.length; i++) {
      if (text[i] === '{') depth++
      else if (text[i] === '}') {
        depth--
        if (depth === 0) { end = i + 1; break }
      }
    }

    return (text.slice(0, start) + text.slice(end)).trim()
  }

  const formatContent = (content) => {
    const cleaned = stripJson(content)
      .replace(/```(?:json)?/gi, '')
      .replace(/```/g, '')
      .trim()

    return cleaned
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#4ade80">$1</strong>')
      .replace(/\n/g, '<br/>')
  }

  const initials = userName?.charAt(0)?.toUpperCase() || 'U'

  const CSAvatar = ({ size = 34 }) => (
    <div style={{
      width: size, height: size, flexShrink: 0,
      borderRadius: '10px', overflow: 'hidden',
      background: '#111711', border: '1px solid #1a2e1a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <img src="/cs-icon.svg" alt="CS" style={{ width: size - 6, height: size - 6, objectFit: 'contain' }} />
    </div>
  )

  const UserAvatar = ({ size = 34 }) => (
    <div style={{
      width: size, height: size, flexShrink: 0,
      background: '#16a34a', borderRadius: '10px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: '700', color: 'white',
    }}>
      {initials}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#0a0f0a', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* ── History Sidebar ─────────────────────────────────────────── */}
        {sidebarOpen && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex',
          }}>
            {/* backdrop */}
            <div
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }}
            />
            {/* panel */}
            <div style={{
              position: 'relative', zIndex: 51,
              width: '320px', background: '#0d150d',
              borderRight: '1px solid #1a2e1a',
              display: 'flex', flexDirection: 'column',
              marginTop: '60px',
            }}>
              {/* header */}
              <div style={{ padding: '16px', borderBottom: '1px solid #1a2e1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>Chat History</div>
                <button
                  onClick={handleNewChat}
                  style={{
                    padding: '6px 14px', background: '#16a34a', border: 'none',
                    borderRadius: '8px', color: 'white', fontWeight: '600',
                    fontSize: '13px', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  }}>
                  + New Chat
                </button>
              </div>

              {/* session list */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {sessions.length === 0 ? (
                  <div style={{ color: '#4b5563', fontSize: '13px', textAlign: 'center', marginTop: '40px' }}>
                    No saved chats yet.<br />Start a conversation to save it here.
                  </div>
                ) : sessions.map(s => (
                  <div
                    key={s.sessionId}
                    onClick={() => handleLoadSession(s)}
                    style={{
                      padding: '12px', borderRadius: '10px', cursor: 'pointer',
                      background: s.sessionId === sessionId ? '#111711' : 'transparent',
                      border: s.sessionId === sessionId ? '1px solid #1a2e1a' : '1px solid transparent',
                      marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { if (s.sessionId !== sessionId) e.currentTarget.style.background = '#0f1a0f' }}
                    onMouseLeave={e => { if (s.sessionId !== sessionId) e.currentTarget.style.background = 'transparent' }}
                  >
                    {/* chat icon */}
                    <div style={{ flexShrink: 0, width: 32, height: 32, background: '#111711', border: '1px solid #1a2e1a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>

                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontSize: '13px', color: '#e5e7eb', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {s.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{s.messages.length} messages</span>
                        {s.prediction !== null && s.prediction !== undefined && (
                          <span style={{ color: '#16a34a' }}>• {CAREERS[s.prediction]}</span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: '#374151', marginTop: '1px' }}>{formatDate(s.savedAt)}</div>
                    </div>

                    {/* delete */}
                    <button
                      onClick={(e) => handleDeleteSession(e, s.sessionId)}
                      title="Delete"
                      style={{
                        flexShrink: 0, background: 'transparent', border: 'none',
                        color: '#4b5563', cursor: 'pointer', padding: '4px',
                        borderRadius: '6px', display: 'flex', alignItems: 'center',
                        fontSize: '16px', lineHeight: 1,
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                      onMouseLeave={e => e.currentTarget.style.color = '#4b5563'}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Main chat area ───────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '820px', width: '100%', margin: '0 auto', padding: '72px 16px 0', overflow: 'hidden', boxSizing: 'border-box' }}>

          {/* Chat header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #1a2e1a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CSAvatar size={42} />
              <div>
                <div style={{ fontWeight: '700', color: 'white', fontSize: '15px' }}>CareerSense AI Advisor</div>
                <div style={{ color: '#16a34a', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', background: '#16a34a', borderRadius: '50%', display: 'inline-block' }}></span>
                  Online — Ready to help
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {/* History button */}
              <button
                onClick={() => setSidebarOpen(true)}
                style={{
                  padding: '7px 14px', background: '#111711',
                  border: '1px solid #1a2e1a', borderRadius: '8px',
                  color: '#9ca3af', cursor: 'pointer', fontSize: '13px',
                  fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                History
              </button>

              <button onClick={handleNewChat} style={{
                padding: '7px 16px', background: '#111711',
                border: '1px solid #1a2e1a', borderRadius: '8px',
                color: '#9ca3af', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif',
              }}>New Chat</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-start', gap: '10px' }}>
                {msg.role === 'assistant' && <CSAvatar size={34} />}
                <div style={{ maxWidth: '75%' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' ? '#16a34a' : '#111711',
                    border: msg.role === 'assistant' ? '1px solid #1a2e1a' : 'none',
                    fontSize: '14px', lineHeight: '1.65',
                    color: msg.role === 'user' ? 'white' : '#e5e7eb',
                  }}>
                    <div dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }} />
                    {msg.prediction !== undefined && msg.prediction !== null && (
                      <div style={{ marginTop: '14px', padding: '14px', background: '#0a0f0a', border: '1px solid rgba(22,163,74,0.4)', borderRadius: '12px' }}>
                        <div style={{ color: '#4ade80', fontSize: '11px', fontWeight: '700', marginBottom: '6px', letterSpacing: '0.05em' }}>CAREER PREDICTION</div>
                        <div style={{ fontWeight: '800', fontSize: '17px', color: 'white', marginBottom: '4px' }}>{CAREERS[msg.prediction]}</div>
                        {msg.probability && (
                          <div style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '12px' }}>{Math.round(msg.probability * 100)}% confidence match</div>
                        )}
                        <button onClick={() => navigate('/result')} style={{
                          width: '100%', padding: '9px', background: '#16a34a',
                          border: 'none', borderRadius: '8px', color: 'white',
                          fontWeight: '700', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif',
                        }}>View Full Results & Roadmap</button>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '4px', paddingLeft: msg.role === 'user' ? 0 : '4px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {msg.time}
                  </div>
                </div>
                {msg.role === 'user' && <UserAvatar size={34} />}
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CSAvatar size={34} />
                <div style={{ padding: '14px 18px', background: '#111711', border: '1px solid #1a2e1a', borderRadius: '18px 18px 18px 4px' }}>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%', animation: 'bounce 1.2s infinite', animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 0 16px', borderTop: '1px solid #1a2e1a' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', background: '#111711', border: '1px solid #1a2e1a', borderRadius: '14px', padding: '10px 14px' }}>
              <textarea ref={textareaRef} value={input} onChange={handleInput} onKeyDown={handleKey}
                placeholder="Type your message... (Enter to send)"
                rows={1}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '14px', resize: 'none', lineHeight: '1.5', maxHeight: '120px', fontFamily: 'Inter, sans-serif' }}
              />
              <button onClick={sendMessage} disabled={loading || !input.trim()}
                style={{ width: '36px', height: '36px', background: input.trim() && !loading ? '#16a34a' : '#1a2e1a', border: 'none', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', flexShrink: 0, transition: 'background 0.2s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#374151' }}>
              CareerSense AI — FUOYE Final Year Project 2026
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        textarea::placeholder { color: #4b5563; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a2e1a; border-radius: 2px; }
      `}</style>
    </div>
  )
}
