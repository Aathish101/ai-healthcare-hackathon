import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'

const AssessmentPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()


  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    bmi: '',
    familyHistory: '',
    smoking: '',
    alcoholConsumption: '',
    exerciseFrequency: '',
    bloodPressure: '',
    bloodSugar: '',
    stressLevel: '',
    sleepHours: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => {
      const updated = { ...prev, [name]: value }

      // Auto-calculate BMI if height and weight are provided
      if (name === 'height' || name === 'weight') {
        const height = name === 'height' ? parseFloat(value) : parseFloat(prev.height)
        const weight = name === 'weight' ? parseFloat(value) : parseFloat(prev.weight)

        if (height && weight && height > 0 && weight > 0) {
          const heightInMeters = height / 100
          const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1)
          updated.bmi = bmi
        } else {
          updated.bmi = ''
        }
      }

      return updated
    })
    setError('')
  }

  const validateForm = () => {
    const required = ['age', 'gender', 'familyHistory', 'smoking', 'alcoholConsumption', 'exerciseFrequency', 'stressLevel', 'sleepHours']

    for (const field of required) {
      if (!formData[field]) {
        setError(`Please fill in all required fields. Missing: ${field}`)
        return false
      }
    }

    // Validate numeric fields
    if (formData.age && (formData.age < 1 || formData.age > 120)) {
      setError('Age must be between 1 and 120')
      return false
    }

    if (formData.stressLevel && (formData.stressLevel < 1 || formData.stressLevel > 10)) {
      setError('Stress level must be between 1 and 10')
      return false
    }

    if (formData.exerciseFrequency && (formData.exerciseFrequency < 0 || formData.exerciseFrequency > 7)) {
      setError('Exercise frequency must be between 0 and 7 days')
      return false
    }

    if (formData.bloodPressure && !/^\d{2,3}\/\d{2,3}$/.test(formData.bloodPressure)) {
      setError('Blood pressure must be in format "systolic/diastolic" (e.g., 120/80)')
      return false
    }

    // Validate height and weight ranges
    if (formData.height) {
      const height = parseFloat(formData.height)
      if (height < 100 || height > 250) {
        setError('Height must be between 100 and 250 cm. Please check your input.')
        return false
      }
    }

    if (formData.weight) {
      const weight = parseFloat(formData.weight)
      if (weight < 20 || weight > 300) {
        setError('Weight must be between 20 and 300 kg. Please check your input.')
        return false
      }
    }

    // Validate BMI if calculated
    if (formData.bmi) {
      const bmi = parseFloat(formData.bmi)
      if (bmi < 10 || bmi > 60) {
        setError(`Calculated BMI (${bmi.toFixed(1)}) is outside the valid range (10-60). Please check your height and weight values.`)
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')

    try {
      // Prepare data for API
      // Don't send BMI if it's invalid - let backend calculate it
      const calculatedBMI = formData.bmi ? parseFloat(formData.bmi) : null
      const validBMI = calculatedBMI && calculatedBMI >= 10 && calculatedBMI <= 60 ? calculatedBMI : undefined

      const assessmentData = {
        userId: user.uid,
        age: parseInt(formData.age),
        gender: formData.gender,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        bmi: validBMI, // Only send if valid, otherwise let backend calculate
        familyHistory: formData.familyHistory,
        smoking: formData.smoking,
        alcoholConsumption: formData.alcoholConsumption,
        exerciseFrequency: parseInt(formData.exerciseFrequency),
        bloodPressure: formData.bloodPressure || undefined,
        bloodSugar: formData.bloodSugar ? parseFloat(formData.bloodSugar) : undefined,
        stressLevel: parseInt(formData.stressLevel),
        sleepHours: parseFloat(formData.sleepHours)
      }

      const response = await axios.post('http://localhost:5000/api/assessment', assessmentData)

      // Store results in sessionStorage for results page
      sessionStorage.setItem('assessmentResults', JSON.stringify(response.data.data))

      toast.success('Assessment completed successfully!')
      navigate('/results')
    } catch (err) {
      console.error('Assessment error:', err)

      // Display detailed validation errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map(e => e.msg).join(', ')
        toast.error(`Validation failed: ${errorMessages}`)
        setError(`Validation failed: ${errorMessages}`)
      } else {
        const errorMsg = err.response?.data?.message ||
          'Failed to process assessment. Please check your inputs and try again.'
        toast.error(errorMsg)
        setError(errorMsg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Assessment</h1>
          <p className="text-xl text-gray-600">
            Fill in your health information to get personalized risk predictions
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="input-field"
                  required
                  min="1"
                  max="120"
                />
              </div>
              <div>
                <label className="label">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Physical Measurements */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Physical Measurements</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="label">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="input-field"
                  min="100"
                  max="250"
                  step="0.1"
                  placeholder="e.g., 175"
                />
                <p className="text-xs text-gray-500 mt-1">Enter height in centimeters (100-250 cm)</p>
              </div>
              <div>
                <label className="label">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="input-field"
                  min="20"
                  max="300"
                  step="0.1"
                  placeholder="e.g., 70"
                />
                <p className="text-xs text-gray-500 mt-1">Enter weight in kilograms (20-300 kg)</p>
              </div>
              <div>
                <label className="label">BMI (auto-calculated)</label>
                <input
                  type="text"
                  name="bmi"
                  value={formData.bmi ? (parseFloat(formData.bmi) < 10 || parseFloat(formData.bmi) > 60 ? 'Invalid' : formData.bmi) : ''}
                  readOnly
                  className={`input-field bg-gray-100 ${formData.bmi && (parseFloat(formData.bmi) < 10 || parseFloat(formData.bmi) > 60) ? 'border-red-300 text-red-600' : ''}`}
                  placeholder="Auto-calculated"
                />
                {formData.bmi && (parseFloat(formData.bmi) < 10 || parseFloat(formData.bmi) > 60) && (
                  <p className="text-xs text-red-600 mt-1">Please check your height and weight values</p>
                )}
              </div>
            </div>
          </div>

          {/* Health History */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Health History</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Family History of Chronic Diseases *</label>
                <select
                  name="familyHistory"
                  value={formData.familyHistory}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <label className="label">Smoking Status *</label>
                <select
                  name="smoking"
                  value={formData.smoking}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lifestyle Factors */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Lifestyle Factors</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Alcohol Consumption *</label>
                <select
                  name="alcoholConsumption"
                  value={formData.alcoholConsumption}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Select</option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div>
                <label className="label">Exercise Frequency (days per week) *</label>
                <input
                  type="number"
                  name="exerciseFrequency"
                  value={formData.exerciseFrequency}
                  onChange={handleChange}
                  className="input-field"
                  required
                  min="0"
                  max="7"
                />
              </div>
            </div>
          </div>

          {/* Medical Tests (Optional) */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Medical Tests (Optional)</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Blood Pressure (e.g., 120/80)</label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="systolic/diastolic"
                  pattern="^\d{2,3}\/\d{2,3}$"
                />
              </div>
              <div>
                <label className="label">Blood Sugar (mg/dL)</label>
                <input
                  type="number"
                  name="bloodSugar"
                  value={formData.bloodSugar}
                  onChange={handleChange}
                  className="input-field"
                  min="50"
                  max="500"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {/* Mental Health */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mental Health & Sleep</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="label">Stress Level (1-10) *</label>
                <input
                  type="number"
                  name="stressLevel"
                  value={formData.stressLevel}
                  onChange={handleChange}
                  className="input-field"
                  required
                  min="1"
                  max="10"
                />
                <p className="text-sm text-gray-500 mt-1">1 = Very Low, 10 = Very High</p>
              </div>
              <div>
                <label className="label">Sleep Hours per Night *</label>
                <input
                  type="number"
                  name="sleepHours"
                  value={formData.sleepHours}
                  onChange={handleChange}
                  className="input-field"
                  required
                  min="0"
                  max="24"
                  step="0.5"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner /> : 'Get Health Risk Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssessmentPage

