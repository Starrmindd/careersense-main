import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'

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

export default function Dashboard() {
  const navigate = useNavigate()
  const { isLoggedIn, userName, userEmail } = useSelector(state => state.auth)
  const { prediction, probability, messages } = useSelector(state => state.chat)

  if (!isLoggedIn) { navigate('/signin'); return null }

  const role = prediction !== null && prediction !== undefined ? CAREERS[prediction] : null
  const confidence = probability ? Math.round(probability * 100) : null

  const card = (children, style = {}) => (
    <div style={{ background: '#111711', border: '1px solid #1a2e1a', borderRadius: '16px', padding: '24px', ...style }}>
      {children}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: '800', marginBottom: '4px' }}>
            Welcome back, <span style={{ color: '#16a34a' }}>{userName}</span>
          </h1>
          <p style={{ color: '#6b7280' }}>Here is your CareerSense overview</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Chat Messages', value: messages.length, sub: 'Total exchanges' },
            { label: 'Confidence Score', value: confidence ? `${confidence}%` : 'N/A', sub: 'Match accuracy' },
            { label: 'Status', value: role ? 'Predicted' : 'Pending', sub: role ? 'Career identified' : 'Chat to get started' },
          ].map((s, i) => (
            card(
              <>
                <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ fontSize: '28px', fontWeight: '800', color: 'white', marginBottom: '4px' }}>{s.value}</p>
                <p style={{ color: '#4ade80', fontSize: '12px' }}>{s.sub}</p>
              </>,
              { key: i }
            )
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '20px' }}>

          {/* Career prediction */}
          {card(
            <>
              <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '12px' }}>Career Prediction</h2>
              {role ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ width: '64px', height: '64px', background: '#16a34a', borderRadius: '16px', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>{role}</h3>
                  {confidence && (
                    <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: '999px', color: '#4ade80', fontSize: '12px', fontWeight: '600', marginBottom: '16px' }}>
                      {confidence}% match
                    </span>
                  )}
                  <br />
                  <button onClick={() => navigate('/result')}
                    style={{ padding: '10px 20px', background: '#16a34a', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                    View Roadmap
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <p style={{ color: '#6b7280', marginBottom: '16px', fontSize: '14px' }}>No prediction yet. Chat with our AI to get your career recommendation.</p>
                  <button onClick={() => navigate('/chat')}
                    style={{ padding: '10px 20px', background: '#16a34a', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
                    Start Chatting
                  </button>
                </div>
              )}
            </>
          )}

          {/* Profile */}
          {card(
            <>
              <h2 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '16px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Profile</h2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '64px', height: '64px', background: '#16a34a', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800', color: 'white' }}>
                  {userName?.charAt(0)?.toUpperCase()}
                </div>
                <div style={{ width: '100%' }}>
                  {[
                    { label: 'Name', value: userName },
                    { label: 'Email', value: userEmail },
                    { label: 'Account', value: 'Active' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid #1a2e1a' : 'none' }}>
                      <span style={{ color: '#6b7280', fontSize: '13px' }}>{item.label}</span>
                      <span style={{ color: item.label === 'Account' ? '#4ade80' : 'white', fontSize: '13px', fontWeight: '500' }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quick actions */}
        {card(
          <>
            <h2 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '16px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {[
                { label: 'Chat with AI', path: '/chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' },
                { label: 'View Results', path: '/result', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                { label: 'Home', path: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              ].map((action, i) => (
                <button key={i} onClick={() => navigate(action.path)}
                  style={{ padding: '14px 12px', background: '#0a0f0a', border: '1px solid #1a2e1a', borderRadius: '10px', color: '#9ca3af', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '500', transition: 'border-color 0.2s' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                  </svg>
                  {action.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
