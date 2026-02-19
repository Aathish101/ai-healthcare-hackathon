import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import BrandLogo from './BrandLogo'
import LanguageSwitcher from './LanguageSwitcher'
import { useTranslation } from 'react-i18next'

const Navbar = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  const isHome = location.pathname === "/"
  const isLogin = location.pathname === "/login"

  if (isLogin) return null;

  return (
    <nav
      className={`w-full z-50 transition-all duration-300 ${isHome
        ? "absolute bg-transparent"
        : "sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100"
        }`}
    >
      <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
        <Link to="/" className="group">
          <BrandLogo isDark={isHome} />
        </Link>

        <div className={`flex items-center gap-6 md:gap-10 ${isHome ? 'text-white/80' : 'text-gray-500'
          }`}>

          <Link
            to="/"
            className={`text-xs font-black uppercase tracking-widest hover:text-white transition-colors ${!isHome && 'hover:text-black'
              }`}
          >
            {t('nav_index')}
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`text-xs font-black uppercase tracking-widest hover:text-white transition-colors ${!isHome && 'hover:text-black'
                }`}
            >
              {t('nav_dashboard')}
            </Link>
          )}

          <Link
            to={isAuthenticated ? '/assessment' : '/login'}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-sm ${isHome
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-black text-white hover:bg-gray-800'
              }`}
          >
            {isAuthenticated ? t('nav_analysis') : t('nav_authorize')}
          </Link>

          {/* 🌍 LANGUAGE BUTTON */}
          <LanguageSwitcher />

        </div>
      </div>
    </nav>
  )
}

export default Navbar
