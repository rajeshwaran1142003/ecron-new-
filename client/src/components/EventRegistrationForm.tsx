import React, { useState } from 'react'
import { Calendar, Clock, MapPin, Users, Star, CheckCircle } from 'lucide-react'
import { createEventRegistration } from '../lib/supabaseClient'

const EventRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    degree: '',
    year: '',
    collegeName: '',
    universityName: '',
    contactNumber: '',
    alternateNumber: '',
    emailId: '',
    captchaAnswer: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [certificateCode, setCertificateCode] = useState('')
  const [error, setError] = useState('')
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Generate captcha question on component mount
  React.useEffect(() => {
    generateCaptcha()
  }, [])

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setCaptchaQuestion({ num1, num2, answer: num1 + num2 })
  }

  const generateCertificateCode = () => {
    const randomCode = Math.floor(1000 + Math.random() * 9000)
    return `C2C-2025-${randomCode}`
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.degree) {
      newErrors.degree = 'Please select your degree'
    }

    if (!formData.year) {
      newErrors.year = 'Please select your year'
    }

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required'
    }

    if (!formData.universityName.trim()) {
      newErrors.universityName = 'University name is required'
    }

    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required'
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid contact number'
    }

    if (formData.alternateNumber && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.alternateNumber)) {
      newErrors.alternateNumber = 'Please enter a valid alternate number'
    }

    if (!formData.emailId.trim()) {
      newErrors.emailId = 'Email ID is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailId)) {
      newErrors.emailId = 'Please enter a valid email address'
    }

    if (!formData.captchaAnswer.trim()) {
      newErrors.captchaAnswer = 'Please solve the captcha'
    } else if (parseInt(formData.captchaAnswer) !== captchaQuestion.answer) {
      newErrors.captchaAnswer = 'Incorrect answer. Please try again.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const generatedCertificateCode = generateCertificateCode()
      
      await createEventRegistration({
        name: formData.name,
        degree: formData.degree,
        year: formData.year,
        college_name: formData.collegeName,
        university_name: formData.universityName,
        contact_number: formData.contactNumber,
        alternate_number: formData.alternateNumber || undefined,
        email_id: formData.emailId,
        certificate_code: generatedCertificateCode
      })

      setCertificateCode(generatedCertificateCode)
      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your registration')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-green-100">
            <CheckCircle size={80} className="text-green-500 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Registration Successful!
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Thank you for joining the Campus-to-Cloud event.
            </p>
            
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 mb-8 border border-blue-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Certificate Code</h3>
              <div className="bg-white rounded-xl p-6 border-2 border-dashed border-blue-300">
                <code className="text-3xl font-bold text-blue-600 tracking-wider">
                  {certificateCode}
                </code>
              </div>
              <p className="text-gray-600 mt-4 text-sm">
                Please save this code. You'll need it to claim your certificate after the event.
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8 border border-green-100">
              <h3 className="text-lg font-bold text-gray-900 mb-2">What happens next?</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• Event details will be shared 24 hours before</li>
                <li>• Bring a valid ID for verification</li>
                <li>• Don't forget your certificate code!</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSubmitted(false)
                  setFormData({
                    name: '',
                    degree: '',
                    year: '',
                    collegeName: '',
                    universityName: '',
                    contactNumber: '',
                    alternateNumber: '',
                    emailId: '',
                    captchaAnswer: ''
                  })
                  generateCaptcha()
                }}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Register Another Person
              </button>
              <a
                href="tel:+918438829844"
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const degreeOptions = ['UG', 'PG']
  const yearOptions = ['1', '2', '3', '4']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Event Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Campus to Cloud Event Registration
            </h1>
            <p className="text-lg text-gray-600">
              Fill out the form below to secure your spot at our exclusive event
            </p>
          </div>

          {/* Event Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Date</p>
                <p className="text-gray-600">March 15, 2025</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Time</p>
                <p className="text-gray-600">2:00 PM - 6:00 PM</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Location</p>
                <p className="text-gray-600">Tech Innovation Center</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-semibold text-gray-900">Capacity</p>
                <p className="text-gray-600">Limited to 100 attendees</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Degree and Year */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                  Degree *
                </label>
                <select
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.degree ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select degree</option>
                  {degreeOptions.map((degree) => (
                    <option key={degree} value={degree}>
                      {degree}
                    </option>
                  ))}
                </select>
                {errors.degree && (
                  <p className="mt-1 text-sm text-red-600">{errors.degree}</p>
                )}
              </div>
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year *
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.year ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select year</option>
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                {errors.year && (
                  <p className="mt-1 text-sm text-red-600">{errors.year}</p>
                )}
              </div>
            </div>

            {/* College Name */}
            <div>
              <label htmlFor="collegeName" className="block text-sm font-medium text-gray-700 mb-1">
                College Name *
              </label>
              <input
                type="text"
                id="collegeName"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.collegeName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your college name"
              />
              {errors.collegeName && (
                <p className="mt-1 text-sm text-red-600">{errors.collegeName}</p>
              )}
            </div>

            {/* University Name */}
            <div>
              <label htmlFor="universityName" className="block text-sm font-medium text-gray-700 mb-1">
                University Name *
              </label>
              <input
                type="text"
                id="universityName"
                name="universityName"
                value={formData.universityName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.universityName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Enter your university name"
              />
              {errors.universityName && (
                <p className="mt-1 text-sm text-red-600">{errors.universityName}</p>
              )}
            </div>

            {/* Contact Numbers */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.contactNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="+91 9876543210"
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactNumber}</p>
                )}
              </div>
              <div>
                <label htmlFor="alternateNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Number
                </label>
                <input
                  type="tel"
                  id="alternateNumber"
                  name="alternateNumber"
                  value={formData.alternateNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.alternateNumber ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="+91 9876543210 (optional)"
                />
                {errors.alternateNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.alternateNumber}</p>
                )}
              </div>
            </div>

            {/* Email ID */}
            <div>
              <label htmlFor="emailId" className="block text-sm font-medium text-gray-700 mb-1">
                Email ID *
              </label>
              <input
                type="email"
                id="emailId"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.emailId ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.emailId && (
                <p className="mt-1 text-sm text-red-600">{errors.emailId}</p>
              )}
            </div>

            {/* Captcha */}
            <div>
              <label htmlFor="captchaAnswer" className="block text-sm font-medium text-gray-700 mb-1">
                Captcha *
              </label>
              <div className="flex items-center gap-4">
                <div className="bg-gray-100 px-4 py-2 rounded-md border">
                  <span className="text-lg font-semibold">
                    {captchaQuestion.num1} + {captchaQuestion.num2} = ?
                  </span>
                </div>
                <input
                  type="number"
                  id="captchaAnswer"
                  name="captchaAnswer"
                  value={formData.captchaAnswer}
                  onChange={handleInputChange}
                  className={`w-20 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.captchaAnswer ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="?"
                />
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Refresh
                </button>
              </div>
              {errors.captchaAnswer && (
                <p className="mt-1 text-sm text-red-600">{errors.captchaAnswer}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EventRegistrationForm