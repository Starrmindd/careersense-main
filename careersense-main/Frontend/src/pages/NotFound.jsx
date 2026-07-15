import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center text-center px-6">
        <div>
          <p className="text-8xl font-bold text-[#16a34a] mb-4">404</p>
          <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
          <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/')}
            className="px-8 py-3 bg-[#16a34a] rounded-xl font-semibold hover:bg-[#15803d] transition-all">
            Go Home
          </button>
        </div>
      </div>
    </div>
  )
}
