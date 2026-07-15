import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addMessage, setPrediction, clearChat } from '../store/chatSlice'
import Navbar from '../components/Navbar'

const API_URL = import.meta.env.VITE_API_URL

const CAREERS = {
  0: "Network Security Engineer", 1: "Software Engineer",
  2: "UI/UX Engineer", 3: "Software Developer",
  4: "Database Developer", 5: "QA Engineer",
  6: "Web Developer", 7: "CRM Technical Developer",
  8: "Technical Supporter", 9: "Systems Security Administrator",
  10: "Applications Developer", 11: "Mobile Applications Developer",
}

export default function Chat() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { messages } = useSelector(state => state.chat)
  const { isLoggedIn, userName } = useSelector(state => state.auth)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9))
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!isLoggedIn) { navigate('/signin'); return }
    if (messages.length === 0) {
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
        role: 'assistant', content: data.response,
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
    dispatch(clearChat())
    setTimeout(() => {
      dispatch(addMessage({
        role: 'assistant',
        content: `Hi ${userName}! Ready for a fresh start?\n\n**What IT topics interest you the most?**`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }))
    }, 100)
  }

  const formatContent = (content) => content
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#4ade80">$1</strong>')
    .replace(/\n/g, '<br/>')

  const initials = userName?.charAt(0)?.toUpperCase() || 'U'

  // CS icon avatar — uses the actual logo icon SVG
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
          <button onClick={handleNewChat} style={{
            padding: '7px 16px', background: '#111711',
            border: '1px solid #1a2e1a', borderRadius: '8px',
            color: '#9ca3af', cursor: 'pointer', fontSize: '13px', fontFamily: 'Inter, sans-serif',
          }}>New Chat</button>
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

          {/* Typing indicator */}
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
