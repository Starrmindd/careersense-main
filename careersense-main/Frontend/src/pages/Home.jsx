import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#0a0f0a', color: 'white', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 24px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>
          
          {/* Left: Text */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#111711', border: '1px solid #1a2e1a', borderRadius: '999px', padding: '6px 16px', marginBottom: '24px' }}>
              <div style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%', animation: 'pulse 2s infinite' }}></div>
              <span style={{ color: '#4ade80', fontSize: '13px', fontWeight: '500' }}>AI-Powered Career Guidance — FUOYE</span>
            </div>

            <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: '800', lineHeight: '1.15', marginBottom: '20px', color: 'white' }}>
              Find Your Ideal<br />
              <span style={{ color: '#16a34a' }}>IT Career Path</span><br />
              with AI
            </h1>

            <p style={{ color: '#9ca3af', fontSize: '17px', lineHeight: '1.7', marginBottom: '36px', maxWidth: '480px' }}>
              CareerSense uses conversational AI and machine learning to understand your skills and interests — then recommends the perfect IT career and guides you every step of the way.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')}
                style={{ padding: '14px 28px', background: '#16a34a', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
                Get Started Free
              </button>
              <button onClick={() => navigate('/signin')}
                style={{ padding: '14px 28px', background: 'transparent', border: '1px solid #1a2e1a', borderRadius: '10px', color: '#9ca3af', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>
                Sign In
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '32px', marginTop: '48px', flexWrap: 'wrap' }}>
              {[
                { value: '12+', label: 'Career Paths' },
                { value: 'AI', label: 'Powered Chat' },
                { value: '100%', label: 'Free to Use' },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#16a34a' }}>{s.value}</div>
                  <div style={{ fontSize: '13px', color: '#6b7280' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Image */}
          <div style={{ flex: '1', minWidth: '280px', display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '460px' }}>
              <img
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80"
                alt="IT career guidance"
                style={{ width: '100%', borderRadius: '20px', border: '1px solid #1a2e1a', display: 'block' }}
              />
              {/* Floating card */}
              <div style={{ position: 'absolute', bottom: '-16px', left: '-16px', background: '#111711', border: '1px solid #16a34a', borderRadius: '14px', padding: '14px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                <div style={{ fontSize: '11px', color: '#4ade80', fontWeight: '600', marginBottom: '4px' }}>LATEST PREDICTION</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: 'white' }}>Software Engineer</div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>94% confidence match</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px', background: '#0d150d' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>How CareerSense Works</h2>
            <p style={{ color: '#9ca3af', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>Simple, intelligent, and personalised — built for IT students at FUOYE.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              {
                img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80',
                title: 'Chat with AI',
                desc: 'Have a natural conversation with our AI advisor. No forms or quizzes — just talk about what you enjoy.'
              },
              {
                img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&q=80',
                title: 'Get Predicted',
                desc: 'Our ML model analyses your responses and predicts the ideal IT career with a confidence score.'
              },
              {
                img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&q=80',
                title: 'Follow Your Roadmap',
                desc: 'Receive a step-by-step roadmap showing exactly what to learn and do to reach your career goal.'
              },
            ].map((f, i) => (
              <div key={i} style={{ background: '#111711', border: '1px solid #1a2e1a', borderRadius: '16px', overflow: 'hidden' }}>
                <img src={f.img} alt={f.title} style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ width: '28px', height: '28px', background: '#16a34a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px' }}>{i + 1}</div>
                    <h3 style={{ fontWeight: '700', fontSize: '16px', color: 'white' }}>{f.title}</h3>
                  </div>
                  <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6' }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAREER PATHS */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '280px' }}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80"
                alt="IT professionals"
                style={{ width: '100%', borderRadius: '16px', border: '1px solid #1a2e1a' }}
              />
            </div>
            <div style={{ flex: '1', minWidth: '280px' }}>
              <h2 style={{ fontSize: '34px', fontWeight: '800', marginBottom: '16px' }}>12 IT Career Paths Available</h2>
              <p style={{ color: '#9ca3af', fontSize: '16px', lineHeight: '1.7', marginBottom: '24px' }}>
                From software development to cybersecurity, UI/UX design to data science — CareerSense covers all major IT career paths and recommends the one that fits you best.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '28px' }}>
                {['Software Engineer', 'UI/UX Designer', 'Data Scientist', 'Network Security', 'Web Developer', 'Mobile Developer', 'Database Admin', 'QA Engineer'].map((c, i) => (
                  <span key={i} style={{ padding: '6px 14px', background: '#111711', border: '1px solid #1a2e1a', borderRadius: '999px', fontSize: '13px', color: '#9ca3af' }}>{c}</span>
                ))}
              </div>
              <button onClick={() => navigate('/register')}
                style={{ padding: '13px 24px', background: '#16a34a', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                Discover Your Path
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: '#0d150d' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&q=80"
            alt="Team collaboration"
            style={{ width: '100%', borderRadius: '16px', marginBottom: '40px', border: '1px solid #1a2e1a' }}
          />
          <h2 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>Ready to find your path?</h2>
          <p style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '28px', lineHeight: '1.7' }}>
            Join IT students at FUOYE who are discovering their ideal careers with CareerSense AI.
          </p>
          <button onClick={() => navigate('/register')}
            style={{ padding: '14px 32px', background: '#16a34a', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', fontSize: '16px', cursor: 'pointer' }}>
            Start Your Assessment
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #1a2e1a', padding: '24px', textAlign: 'center', color: '#4b5563', fontSize: '13px' }}>
        2026 CareerSense — Final Year Project, Federal University Oye-Ekiti (FUOYE) | Department of Computer Science
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
