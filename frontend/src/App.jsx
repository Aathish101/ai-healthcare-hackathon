import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import PrivateRoute from './components/PrivateRoute'
import LandingPage from './pages/LandingPage'
import AssessmentPage from './pages/AssessmentPage'
import ResultsPage from './pages/ResultsPage'
import DashboardPage from './pages/DashboardPage'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import ProfileSelectionPage from './pages/ProfileSelectionPage'

function App() {
  const { i18n } = useTranslation()

  useEffect(() => {
    // Handle RTL support for Arabic
    const dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.dir = dir
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/profiles"
              element={
                <PrivateRoute>
                  <ProfileSelectionPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/assessment"
              element={
                <PrivateRoute>
                  <AssessmentPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/results"
              element={
                <PrivateRoute>
                  <ResultsPage />
                </PrivateRoute>
              }
            />
          </Routes>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'text-[10px] font-black uppercase tracking-widest rounded-2xl border-2 border-gray-50 shadow-2xl',
              style: {
                borderRadius: '16px',
                background: '#000',
                color: '#fff',
              }
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
