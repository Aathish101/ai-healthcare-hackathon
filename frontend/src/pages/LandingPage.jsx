import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Footer from '../components/Footer'
import {
  ShieldCheckIcon,
  ChartBarIcon,
  HeartIcon,
  SparklesIcon
} from '../components/Icons'

import { useTranslation } from 'react-i18next'

const LandingPage = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: t('feature_risk_title'),
      description: t('feature_risk_desc')
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: t('feature_ai_title'),
      description: t('feature_ai_desc')
    },
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: t('feature_protocol_title'),
      description: t('feature_protocol_desc')
    },
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: t('feature_points_title'),
      description: t('feature_points_desc')
    }
  ]

  const benefits = [
    t('benefit_1'),
    t('benefit_2'),
    t('benefit_3'),
    t('benefit_4'),
    t('benefit_5')
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center bg-black overflow-hidden px-6">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50 grayscale"
          >
            <source src="/health-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl">
          <div className="inline-block px-4 py-1.5 mb-8 text-[10px] font-black tracking-[0.4em] text-white uppercase border border-white/20 rounded-full animate-fade-up">
            {t('hero_tagline')}
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-tight animate-slide-in" dangerouslySetInnerHTML={{ __html: t('hero_title').replace('Health ', 'Health<br />') }}>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-medium mb-12 animate-fade-up">
            {t('hero_description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-up">
            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="btn-primary py-5 px-12 group"
            >
              {t('btn_initialize')}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-4 block">{t('institutional_framework')}</span>
              <h2 className="text-5xl font-black text-black mb-8 tracking-tighter uppercase">{t('philosophy_title_1')}<br />{t('philosophy_title_2')}</h2>
              <p className="text-xl text-gray-500 font-medium leading-relaxed mb-10">
                {t('philosophy_desc')}
              </p>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="w-6 h-6 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-black transition-colors">
                      <div className="w-1.5 h-1.5 bg-black group-hover:bg-white rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 rounded-[4rem] p-16 border-2 border-gray-100 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-black/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10">
                <div className="text-8xl font-black text-black mb-4">05</div>
                <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-4">{t('critical_vectors')}</h3>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs leading-loose">
                  {t('vector_list')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-24">
            <h2 className="text-4xl font-black tracking-tighter uppercase">{t('technology_stack')}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="group border-l border-white/10 pl-8 transition-colors hover:border-white">
                <div className="text-gray-600 mb-8 transition-colors group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">{feature.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-black text-black mb-8 tracking-tighter uppercase">{t('audit_your_health')}</h2>
          <p className="text-xl text-gray-500 font-medium mb-12">
            {t('cta_desc')}
          </p>
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            className="btn-primary py-6 px-16 text-lg tracking-widest"
          >
            {isAuthenticated ? t('access_dashboard') : t('initialize_protocol_cta')}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage
