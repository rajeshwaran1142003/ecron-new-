import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './components/AuthProvider'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Courses from './components/Courses'
import Events from './components/Events'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import EventRegistrationForm from './components/EventRegistrationForm'
import CourseDetailPage from './components/CourseDetailPage'
import ContactPage from './components/ContactPage'
import ModernContactPage from './components/ModernContactPage'
import UserProfile from './components/UserProfile'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Header />
            <Routes>
              <Route path="/" element={
                <main>
                  <Hero />
                  <About />
                  <Courses />
                  <Events />
                  <Contact />
                </main>
              } />
              <Route path="/events/campus-to-cloud" element={
                <EventRegistrationForm />
              } />
              <Route path="/course/:id" element={
                <CourseDetailPage />
              } />
              <Route path="/contact" element={
                <ContactPage />
              } />
              <Route path="/contact-modern" element={
                <ModernContactPage />
              } />
              <Route path="/profile" element={
                <UserProfile />
              } />
            </Routes>
            <Footer />
            <WhatsAppFloat />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App