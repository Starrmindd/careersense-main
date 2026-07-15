import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import Navbar from '../components/Navbar'
import Swal from 'sweetalert2'

const API = import.meta.env.VITE_API_URL

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetStep, setResetStep] = useState(1)
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const inputStyle = {
    width: '100%', padding: '13px 16px', background: '#0d150d',
    border: '1px solid #1a2e1a', borderRadius: '10px', color: 'white',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s', fontFamily: 'Inter, sans-serif',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      Swal.fire({ icon: 'error', title: 'Missing fields', text: 'Please fill in all fields.' }); return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/signin/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) {
        setLoading(false)
        Swal.fire({ icon: 'error', title: 'Login Failed', text: 'Invalid email or password.' }); return
      }
      dispatch(login({ name: data.name, email: form.email }))
      setLoading(false)
      navigate('/chat')
    } catch {
      setLoading(false)
      Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong. Try again.' })
    }
  }

  const handleReset = async () => {
    if (resetStep === 1) {
      if (!resetEmail) { Swal.fire({ icon: 'error', title: 'Error', text: 'Enter your email.' }); return }
      const res = await fetch(`${API}/api/auth/check-email/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      })
      const data = await res.json()
      if (!data.exists) { Swal.fire({ icon: 'error', title: 'Not found', text: 'No account with that email.' }); return }
      setResetStep(2)
    } else {
      if (newPass !== confirmPass) { Swal.fire({ icon: 'error', title: 'Error', text: 'Passwords do not match.' }); return }
      if (newPass.length < 6) { Swal.fire({ icon: 'error', title: 'Error', text: 'Minimum 6 characters.' }); return }
      const res = await fetch(`${API}/api/auth/reset-password/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, new_password: newPass }),
      })
      const data = await res.json()
      if (data.success) {
        Swal.fire({ icon: 'success', title: 'Password Reset!', text: 'You can now log in.' })
        setShowForgot(false); setResetStep(1); setResetEmail(''); setNewPass(''); setConfirmPass('')
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px' }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>

          {/* Logo at top */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/cs-logo.svg" alt="CareerSense" style={{ height: '52px', margin: '0 auto 20px', display: 'block' }} />
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>Welcome back</h1>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>Sign in to continue your career journey</p>
          </div>

          {/* Form card */}
          <div style={{ background: '#111711', border: '1px solid #1a2e1a', borderRadius: '16px', padding: '32px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                <input type="email" placeholder="you@email.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  style={inputStyle} />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
                <input type="password" placeholder="Enter your password" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={inputStyle} />
              </div>

              <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                <button type="button" onClick={() => setShowForgot(true)}
                  style={{ background: 'none', border: 'none', color: '#16a34a', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0 }}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', background: '#16a34a',
                border: 'none', borderRadius: '10px', color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, fontFamily: 'Inter, sans-serif',
              }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #1a2e1a' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Don't have an account? </span>
              <Link to="/register" style={{ color: '#16a34a', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                Create one
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '16px' }}>
          <div style={{ background: '#111711', border: '1px solid #1a2e1a', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '420px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', marginBottom: '8px' }}>Reset Password</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
              {resetStep === 1 ? 'Enter your registered email to get started.' : `Create a new password for ${resetEmail}`}
            </p>
            {resetStep === 1 ? (
              <input type="email" placeholder="your@email.com" value={resetEmail}
                onChange={e => setResetEmail(e.target.value)} style={{ ...inputStyle, marginBottom: '16px' }} />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                <input type="password" placeholder="New password" value={newPass}
                  onChange={e => setNewPass(e.target.value)} style={inputStyle} />
                <input type="password" placeholder="Confirm new password" value={confirmPass}
                  onChange={e => setConfirmPass(e.target.value)} style={inputStyle} />
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleReset} style={{
                flex: 1, padding: '12px', background: '#16a34a', border: 'none',
                borderRadius: '10px', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px',
              }}>{resetStep === 1 ? 'Next' : 'Reset Password'}</button>
              <button onClick={() => { setShowForgot(false); setResetStep(1) }} style={{
                flex: 1, padding: '12px', background: '#0a0f0a', border: '1px solid #1a2e1a',
                borderRadius: '10px', color: '#9ca3af', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
