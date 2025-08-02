import React, { useState } from 'react'
import { useAuth } from '../AuthProvider'
import AuthModal from './AuthModal'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100">
        <div className="text-center max-w-md mx-auto p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome</h1>
          <p className="text-gray-600 mb-8">Please sign in to access your account</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Sign In
          </button>
        </div>
        <AuthModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedRoute