import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, isAuthenticated } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://i.ibb.co/xSkh16zY/Chat-GPT-Image-Feb-18-2026-10-37-07-AM-removebg-preview.png"
              alt="Aurevia Health"
              className="h-20 md:h-24 w-auto object-contain"
            />
            <span className="text-2xl font-bold text-gray-900 hidden sm:block"></span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-medical-blue transition-colors"
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-medical-blue transition-colors"
              >
                Dashboard
              </Link>
            )}
            <Link
              to={isAuthenticated ? '/assessment' : '/login'}
              className="btn-primary text-sm"
            >
              {isAuthenticated ? 'New Assessment' : 'Start Assessment'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

