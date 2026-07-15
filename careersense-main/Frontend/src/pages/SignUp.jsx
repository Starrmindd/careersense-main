import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../store/authSlice'
import Navbar from '../components/Navbar'
import Swal from 'sweetalert2'

const API = import.meta.env.VITE_API_URL

export default function SignUp() {
  const [form, setForm] = useState({ name: '', age: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const inputStyle = {
    width: '100%', padding: '13px 16px', background: '#0d150d',
    border: '1px solid #1a2e1a', borderRadius: '10px', color: 'white',
    fontSize: '15px', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.age || !form.email || !form.password) {
      Swal.fire({ icon: 'error', title: 'Missing fields', text: 'Please fill in all fields.' }); return
    }
    if (form.password.length < 6) {
      Swal.fire({ icon: 'error', title: 'Weak password', text: 'Password must be at least 6 characters.' }); return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/signup/`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!data.success) {
        setLoading(false)
        Swal.fire({ icon: 'error', title: 'Account exists', text: 'An account with this email already exists.' }); return
      }
      dispatch(login({ name: form.name, email: form.email }))
      setLoading(false)
      Swal.fire({ icon: 'success', title: `Welcome, ${form.name}!`, text: 'Your account has been created.', showConfirmButton: false, timer: 1500 })
      setTimeout(() => navigate('/chat'), 1500)
    } catch {
      setLoading(false)
      Swal.fire({ icon: 'error', title: 'Error', text: 'Something went wrong. Try again.' })
    }
  }

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. John Doe' },
    { key: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 22' },
    { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@email.com' },
    { key: 'password', label: 'Password', type: 'password', placeholder: 'Min. 6 characters' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px' }}>
        <div style={{ width: '100%', maxWidth: '460px' }}>

          {/* Logo + heading */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/cs-logo.svg" alt="CareerSense" style={{ height: '52px', margin: '0 auto 20px', display: 'block' }} />
            <h1 style={{ fontSize: '26px', fontWeight: '800', color: 'white', marginBottom: '6px' }}>Create Your Account</h1>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>Start your AI-powered career discovery journey</p>
          </div>

          {/* Form card */}
          <div style={{ background: '#111711', border: '1px solid #1a2e1a', borderRadius: '16px', padding: '32px' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
                {fields.map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', color: '#9ca3af', fontSize: '13px', fontWeight: '600', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {f.label}
                    </label>
                    <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                      style={inputStyle} />
                  </div>
                ))}
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', padding: '14px', background: '#16a34a',
                border: 'none', borderRadius: '10px', color: 'white',
                fontWeight: '700', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, fontFamily: 'Inter, sans-serif',
              }}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #1a2e1a' }}>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Already have an account? </span>
              <Link to="/signin" style={{ color: '#16a34a', fontWeight: '700', fontSize: '14px', textDecoration: 'none' }}>
                Sign In
              </Link>
            </div>
          </div>

          {/* Trust note */}
          <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '12px', marginTop: '16px' }}>
            Free to use. No credit card required. Built for FUOYE students.
          </p>
        </div>
      </div>
    </div>
  )
}
