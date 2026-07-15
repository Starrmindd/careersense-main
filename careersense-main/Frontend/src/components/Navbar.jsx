import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/authSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isLoggedIn, userName } = useSelector(state => state.auth)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setMenuOpen(false)
  }

  const links = [
    { path: '/', label: 'Home' },
    { path: '/chat', label: 'AI Advisor' },
    { path: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(10,15,10,0.97)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1a2e1a',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 28px', height: '72px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* LOGO */}
          <Link to="/" onClick={() => setMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            {/* Desktop: full logo */}
            <img src="/cs-logo.svg" alt="CareerSense" className="nav-logo-full"
              style={{ height: '48px', display: 'block', objectFit: 'contain' }} />
            {/* Mobile: icon only */}
            <img src="/cs-icon.svg" alt="CS" className="nav-logo-icon"
              style={{ height: '44px', display: 'none', objectFit: 'contain' }} />
          </Link>

          {/* Desktop nav links */}
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {links.map(link => (
              <Link key={link.path} to={link.path} style={{
                color: location.pathname === link.path ? '#16a34a' : '#9ca3af',
                textDecoration: 'none', fontSize: '15px', fontWeight: '500',
                borderBottom: location.pathname === link.path ? '2px solid #16a34a' : '2px solid transparent',
                paddingBottom: '3px', transition: 'color 0.2s',
              }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth */}
          <div className="nav-auth" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {isLoggedIn ? (
              <>
                <span style={{ color: '#6b7280', fontSize: '14px' }}>
                  Hi, <strong style={{ color: 'white' }}>{userName}</strong>
                </span>
                <button onClick={handleLogout} style={{
                  padding: '8px 18px', background: 'transparent',
                  border: '1px solid #7f1d1d', borderRadius: '8px',
                  color: '#f87171', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/signin" style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Sign In</Link>
                <Link to="/register" style={{
                  padding: '9px 20px', background: '#16a34a', borderRadius: '8px',
                  color: 'white', textDecoration: 'none', fontSize: '14px', fontWeight: '700',
                }}>Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="nav-hamburger"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9ca3af' }}>
            {menuOpen
              ? <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            background: '#0d150d', borderTop: '1px solid #1a2e1a',
            padding: '12px 28px 20px', display: 'flex', flexDirection: 'column', gap: '2px',
          }}>
            {links.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)} style={{
                color: location.pathname === link.path ? '#16a34a' : '#d1d5db',
                textDecoration: 'none', fontSize: '15px', fontWeight: '500',
                padding: '12px 0', borderBottom: '1px solid #1a2e1a',
              }}>{link.label}</Link>
            ))}
            <div style={{ paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {isLoggedIn ? (
                <>
                  <span style={{ color: '#6b7280', fontSize: '13px' }}>Signed in as <strong style={{ color: 'white' }}>{userName}</strong></span>
                  <button onClick={handleLogout} style={{
                    padding: '11px', background: 'transparent', border: '1px solid #7f1d1d',
                    borderRadius: '8px', color: '#f87171', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                  }}>Logout</button>
                </>
              ) : (
                <>
                  <Link to="/signin" onClick={() => setMenuOpen(false)} style={{
                    padding: '11px', color: '#d1d5db', textDecoration: 'none', fontSize: '14px',
                    fontWeight: '500', textAlign: 'center', border: '1px solid #1a2e1a', borderRadius: '8px',
                  }}>Sign In</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} style={{
                    padding: '11px', background: '#16a34a', color: 'white', textDecoration: 'none',
                    fontSize: '14px', fontWeight: '700', textAlign: 'center', borderRadius: '8px',
                  }}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (min-width: 768px) {
          .nav-logo-full { display: block !important; }
          .nav-logo-icon { display: none !important; }
          .nav-links { display: flex !important; }
          .nav-auth { display: flex !important; }
          .nav-hamburger { display: none !important; }
        }
        @media (max-width: 767px) {
          .nav-logo-full { display: none !important; }
          .nav-logo-icon { display: block !important; }
          .nav-links { display: none !important; }
          .nav-auth { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </>
  )
}
