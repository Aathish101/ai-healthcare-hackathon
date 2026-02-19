import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import Chatbot from '../components/Chatbot'
import LoadingSpinner from '../components/LoadingSpinner'

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchAssessments()
    }
  }, [user])

  const fetchAssessments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/assessment/user/${user.uid}`
      )
      setAssessments(response.data.data || [])
    } catch (error) {
      console.error('Error fetching assessments:', error)
      toast.error('Failed to load assessments')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAssessment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assessment?')) {
      return
    }

    try {
      await axios.delete(`http://localhost:5000/api/assessment/${id}`, {
        data: { userId: user.uid }
      })
      toast.success('Assessment deleted successfully')
      fetchAssessments()
    } catch (error) {
      console.error('Error deleting assessment:', error)
      toast.error('Failed to delete assessment')
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const latestAssessment = assessments[0]
  const chartData = assessments
    .slice()
    .reverse()
    .map((assessment, index) => ({
      date: new Date(assessment.createdAt).toLocaleDateString(),
      bmi: assessment.bmi || 0,
      stressLevel: assessment.stressLevel || 0,
      sleepHours: assessment.sleepHours || 0,
      riskScore: assessment.riskScore || 0
    }))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600 mt-1">Monitor your health journey</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/assessment')}
              className="btn-primary"
            >
              Start New Assessment
            </button>
            <button
              onClick={handleLogout}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Latest Risk Score
            </h3>
            <div className="text-3xl font-bold text-medical-blue">
              {latestAssessment ? `${latestAssessment.riskScore}/100` : 'N/A'}
            </div>
            {latestAssessment && (
              <p className="text-sm text-gray-600 mt-2">
                {latestAssessment.riskScore < 30 ? 'Low Risk' :
                 latestAssessment.riskScore < 60 ? 'Moderate Risk' : 'High Risk'}
              </p>
            )}
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Total Assessments
            </h3>
            <div className="text-3xl font-bold text-medical-blue">
              {assessments.length}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Health records tracked
            </p>
          </div>

          <div className="card">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Last Assessment
            </h3>
            <div className="text-lg font-semibold text-gray-900">
              {latestAssessment 
                ? new Date(latestAssessment.createdAt).toLocaleDateString()
                : 'No assessments yet'}
            </div>
            {latestAssessment && (
              <p className="text-sm text-gray-600 mt-2">
                {new Date(latestAssessment.createdAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        </div>

        {/* Charts */}
        {assessments.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* BMI Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                BMI Over Time
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="bmi" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    name="BMI"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Stress & Sleep Chart */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Stress Level & Sleep Hours
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="stressLevel" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    name="Stress Level"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="sleepHours" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Sleep Hours"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Assessment History */}
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Assessment History
          </h2>
          {assessments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No assessments yet</p>
              <button
                onClick={() => navigate('/assessment')}
                className="btn-primary"
              >
                Start Your First Assessment
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      BMI
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assessments.map((assessment) => (
                    <tr key={assessment._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(assessment.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          assessment.riskScore < 30 ? 'bg-green-100 text-green-800' :
                          assessment.riskScore < 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {assessment.riskScore}/100
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assessment.bmi || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            sessionStorage.setItem('assessmentResults', JSON.stringify({
                              assessment: {
                                ...assessment,
                                timestamp: assessment.createdAt
                              },
                              risks: assessment.risks,
                              overallHealthScore: assessment.riskScore,
                              recommendations: assessment.recommendations,
                              confidenceScore: 95
                            }))
                            navigate('/results')
                          }}
                          className="text-medical-blue hover:text-medical-dark mr-4"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteAssessment(assessment._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Chatbot */}
        <Chatbot userId={user?.uid} />
      </div>
    </div>
  )
}

export default DashboardPage

