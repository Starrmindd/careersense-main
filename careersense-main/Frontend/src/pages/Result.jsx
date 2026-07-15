import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from '../components/Navbar'

const CAREERS = {
  0: "Network Security Engineer", 1: "Software Engineer",
  2: "UI/UX Engineer", 3: "Software Developer",
  4: "Database Developer", 5: "QA Engineer",
  6: "Web Developer", 7: "CRM Technical Developer",
  8: "Technical Supporter", 9: "Systems Security Administrator",
  10: "Applications Developer", 11: "Mobile Applications Developer",
}

const ROADMAPS = {
  0: ["Learn networking fundamentals (TCP/IP, DNS, HTTP)", "Study cybersecurity concepts and ethical hacking", "Get CompTIA Security+ or CEH certification", "Practice with tools like Wireshark, Nmap, Metasploit", "Apply for junior network security roles"],
  1: ["Master data structures and algorithms", "Learn a core language deeply (Python, Java, or C++)", "Build 3-5 projects for your portfolio", "Contribute to open source projects", "Apply for software engineering internships"],
  2: ["Learn design fundamentals (typography, colour, layout)", "Master Figma or Adobe XD", "Study user research and UX principles", "Build a portfolio of 5+ UI/UX case studies", "Apply for junior designer roles"],
  3: ["Pick a stack (React + Node.js or Django + React)", "Build full-stack projects", "Learn Git and version control", "Understand databases (SQL and NoSQL)", "Deploy projects to the cloud"],
  4: ["Learn SQL deeply (MySQL, PostgreSQL)", "Study database design and normalisation", "Learn NoSQL databases (MongoDB, Redis)", "Practice query optimisation", "Get Oracle or Microsoft SQL certification"],
  5: ["Learn software testing fundamentals", "Master automated testing tools (Selenium, Cypress)", "Study API testing with Postman", "Learn CI/CD pipelines", "Get ISTQB certification"],
  6: ["Master HTML, CSS, and JavaScript", "Learn React or Vue.js", "Study responsive design and accessibility", "Learn backend basics (Node.js or Django)", "Build and deploy 5 websites"],
  7: ["Learn CRM platforms (Salesforce, HubSpot)", "Study business process analysis", "Learn SQL for data querying", "Get Salesforce Developer certification", "Build CRM integration projects"],
  8: ["Develop strong communication skills", "Learn IT support fundamentals", "Get CompTIA A+ certification", "Practice troubleshooting methodologies", "Apply for IT helpdesk roles"],
  9: ["Study system administration (Linux, Windows Server)", "Learn identity and access management", "Study compliance frameworks (ISO 27001, NIST)", "Get CompTIA Security+ certification", "Practice incident response"],
  10: ["Master a programming language (Java, Python, Kotlin)", "Learn software architecture patterns", "Study APIs and microservices", "Build and publish applications", "Learn cloud deployment (AWS, GCP)"],
  11: ["Learn React Native or Flutter", "Study iOS and Android fundamentals", "Build and publish a mobile app", "Learn mobile UI/UX best practices", "Apply for junior mobile developer roles"],
}

const CAREER_IMAGES = {
  0: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
  1: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=80",
  2: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
  3: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
  4: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&q=80",
  5: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
  6: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=600&q=80",
  7: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  8: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80",
  9: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
  10: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
  11: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=600&q=80",
}

export default function Result() {
  const navigate = useNavigate()
  const { prediction, probability } = useSelector(state => state.chat)

  if (prediction === null || prediction === undefined) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f0a', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <p style={{ color: '#9ca3af', fontSize: '18px' }}>No prediction yet.</p>
          <button onClick={() => navigate('/chat')}
            style={{ padding: '12px 24px', background: '#16a34a', border: 'none', borderRadius: '10px', color: 'white', fontWeight: '700', cursor: 'pointer' }}>
            Chat with AI Advisor
          </button>
        </div>
      </div>
    )
  }

  const role = CAREERS[prediction]
  const confidence = probability ? Math.round(probability * 100) : null
  const roadmap = ROADMAPS[prediction] || []
  const careerImg = CAREER_IMAGES[prediction] || CAREER_IMAGES[1]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0a', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '100px 24px 60px' }}>

        {/* Result hero */}
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '48px' }}>
          <img src={careerImg} alt={role} style={{ width: '100%', maxWidth: '380px', borderRadius: '16px', border: '1px solid #1a2e1a', objectFit: 'cover', height: '260px' }} />
          <div style={{ flex: 1, minWidth: '260px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>CareerSense recommends</p>
            <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: '800', color: 'white', marginBottom: '16px', lineHeight: '1.2' }}>{role}</h1>
            {confidence && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#111711', border: '1px solid #16a34a', borderRadius: '999px', padding: '6px 16px', marginBottom: '20px' }}>
                <div style={{ width: '8px', height: '8px', background: '#16a34a', borderRadius: '50%' }}></div>
                <span style={{ color: '#4ade80', fontSize: '14px', fontWeight: '600' }}>{confidence}% confidence match</span>
              </div>
            )}
            <p style={{ color: '#9ca3af', lineHeight: '1.7', marginBottom: '24px' }}>
              Based on your conversation with CareerSense AI, this career aligns perfectly with your skills, interests, and personality. You have what it takes — start building your future today!
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/chat')}
                style={{ padding: '11px 20px', background: '#16a34a', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>
                Continue Chatting
              </button>
              <button onClick={() => navigate('/dashboard')}
                style={{ padding: '11px 20px', background: '#111711', border: '1px solid #1a2e1a', borderRadius: '8px', color: '#9ca3af', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
                View Dashboard
              </button>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div style={{ background: '#111711', border: '1px solid #1a2e1a', borderRadius: '16px', padding: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: 'white' }}>Your Career Roadmap</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {roadmap.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <div style={{ width: '32px', height: '32px', background: '#16a34a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ paddingTop: '6px', color: '#d1d5db', fontSize: '15px', lineHeight: '1.5' }}>{step}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
