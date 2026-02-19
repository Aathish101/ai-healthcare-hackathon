import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Footer from '../components/Footer'
import {
  ShieldCheckIcon,
  ChartBarIcon,
  HeartIcon,
  SparklesIcon,
  CheckCircleIcon
} from '../components/Icons'

const LandingPage = () => {
  const { isAuthenticated } = useAuth()
  
  const features = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Early Risk Detection',
      description: 'Identify potential health risks before they become serious problems'
    },
    {
      icon: <ChartBarIcon className="w-8 h-8" />,
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze your health data to provide accurate risk assessments'
    },
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: 'Personalized Insights',
      description: 'Receive tailored recommendations based on your unique health profile'
    },
    {
      icon: <SparklesIcon className="w-8 h-8" />,
      title: 'Preventive Care',
      description: 'Take proactive steps to maintain and improve your health'
    }
  ]

  const benefits = [
    'Predict risk for 5 major lifestyle diseases',
    'Get personalized health recommendations',
    'Track your health score over time',
    'Download detailed health reports',
    '100% privacy-focused and secure'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-medical-blue via-blue-600 to-medical-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Early Health Risk Prediction
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Take control of your health with AI-powered preventive care.
              Predict and prevent lifestyle diseases before they impact your life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to={isAuthenticated ? '/dashboard' : '/login'} 
                className="btn-primary bg-white text-medical-blue hover:bg-gray-100 text-lg px-8 py-4"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Start Free Assessment'}
              </Link>
              <a href="#features" className="btn-secondary border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">About Ayurevia Health</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ayurevia Health is a cutting-edge health risk prediction platform that uses advanced
              algorithms to analyze your health indicators and predict early risks for major
              lifestyle diseases including Diabetes, Heart Disease, Hypertension, Obesity, and Stress Disorders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mt-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Why Ayurevia Health?</h3>
              <p className="text-gray-600 mb-6">
                Early detection is the key to preventing serious health conditions. Our platform
                combines medical research with AI technology to provide you with actionable insights
                about your health risks.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircleIcon className="w-6 h-6 text-medical-blue mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-medical-light to-blue-100 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-medical-blue mb-4">5</div>
                <div className="text-2xl font-semibold text-gray-900 mb-2">Disease Risk Categories</div>
                <div className="text-gray-600">Comprehensive health analysis</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to understand and improve your health
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center">
                <div className="text-medical-blue mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-medical-blue text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get your personalized health risk assessment in just a few minutes.
            It's free, fast, and completely confidential.
          </p>
          <Link 
            to={isAuthenticated ? '/dashboard' : '/login'} 
            className="btn-primary bg-white text-medical-blue hover:bg-gray-100 text-lg px-10 py-4 inline-block"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Start Your Assessment Now'}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default LandingPage

