import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTranslation } from 'react-i18next'

const AssessmentPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()

  // 1. STATE INITIALIZATION (MUST BE AT TOP)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [bmi, setBmi] = useState(null)
  const [formData, setFormData] = useState({
    biologicalAge: '',
    birthGender: '',
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
    sleepHours: '',
    occupation: '',
    workType: '',
    workingHours: '',
    nightShift: '',
    workStress: '',
    useSmartwatch: '',
    dailySteps: '',
    avgHeartRate: '',
    dietType: '',
    fastFoodFrequency: '',
    waterIntake: '',
    screenTime: '',
    sleepQuality: '',
    physicalActivity: '',
    fruitVeg: ''
  })

  // 2. LIFECYCLE EFFECTS
  useEffect(() => {
    if (!sessionStorage.getItem('selectedProfileId')) {
      toast.error('Please select a profile first')
      navigate('/profiles')
    }
  }, [navigate])

  // Real-time BMI Calculation Logic
  useEffect(() => {
    if (formData.height && formData.weight) {
      const h = parseFloat(formData.height) / 100
      const w = parseFloat(formData.weight)
      if (h > 0) {
        const calculatedBmi = (w / (h * h)).toFixed(1)
        setBmi(calculatedBmi)
        setFormData(prev => ({ ...prev, bmi: calculatedBmi }))
      }
    }
  }, [formData.height, formData.weight])

  // 3. EVENT HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const validateForm = () => {
    const required = [
      'biologicalAge', 'birthGender', 'familyHistory', 'smoking',
      'alcoholConsumption', 'exerciseFrequency', 'stressLevel',
      'sleepHours', 'workType', 'nightShift', 'dietType',
      'fastFoodFrequency', 'sleepQuality', 'physicalActivity',
      'useSmartwatch'
    ]
    for (const field of required) {
      if (!formData[field]) {
        setError(`Please fill in all required fields. Missing: ${field}`)
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError('')

    try {
      // Map frontend fields (biologicalAge, birthGender) to backend model (age, gender)
      const payload = {
        profileId: sessionStorage.getItem('selectedProfileId'),
        age: parseInt(formData.biologicalAge),
        gender: formData.birthGender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        bmi: parseFloat(bmi),
        exerciseFrequency: parseInt(formData.exerciseFrequency) || 0,
        stressLevel: parseInt(formData.stressLevel) || 0,
        sleepHours: parseFloat(formData.sleepHours) || 0,
        workingHours: parseFloat(formData.workingHours) || 0,
        screenTime: parseFloat(formData.screenTime) || 0,
        waterIntake: parseFloat(formData.waterIntake) || 0,
      }

      const response = await axios.post(
  "https://ai-healthcare-hackathon.onrender.com/api/assessment",
  formData
)
      sessionStorage.setItem('assessmentResults', JSON.stringify(response.data.data))
      toast.success('Biometric Analysis Complete')
      navigate('/results')
    } catch (err) {
      console.error('Submission failed:', err)
      const errorMsg = err.response?.data?.message || 'Assessment engine synchronization failed. Please verify all metrics.'
      toast.error(errorMsg)
      setError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-16 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-1.5 mb-4 text-[10px] font-black tracking-widest text-white uppercase bg-black rounded-full">
            {t('biometric_analysis')}
          </span>
          <h1 className="text-5xl font-black text-black mb-6 tracking-tighter">
            {t('health_assessment')}
          </h1>
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto">
            {t('assessment_desc')}
          </p>
        </div>

        {error && (
          <div className="bg-black text-white px-6 py-4 rounded-2xl mb-8 flex items-center gap-3 animate-slide-in">
            <span className="font-bold text-xs uppercase tracking-widest">Error:</span>
            <span className="text-sm font-medium opacity-80">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section: Core Metrics */}
          <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-all">
            <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-3 tracking-tighter">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs">01</span>
              {t('primary_indicators')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="label">{t('bio_age')}</label>
                <input type="number" name="biologicalAge" value={formData.biologicalAge} onChange={handleChange} className="input-field" required min="1" max="120" />
              </div>
              <div className="space-y-2">
                <label className="label">{t('birth_gender')}</label>
                <select name="birthGender" value={formData.birthGender} onChange={handleChange} className="input-field" required>
                  <option value="">{t('select')}</option>
                  <option value="Male">{t('male')}</option>
                  <option value="Female">{t('female')}</option>
                  <option value="Other">{t('other')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label">{t('height_cm')}</label>
                <input type="number" name="height" value={formData.height} onChange={handleChange} className="input-field" placeholder="175" />
              </div>
              <div className="space-y-2">
                <label className="label">{t('weight_kg')}</label>
                <input type="number" name="weight" value={formData.weight} onChange={handleChange} className="input-field" placeholder="70" />
              </div>
            </div>
          </div>

          {/* Section: Medical History */}
          <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-all">
            <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-3 tracking-tighter">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs">02</span>
              {t('clinical_context')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="label">{t('family_history')}</label>
                <select name="familyHistory" value={formData.familyHistory} onChange={handleChange} className="input-field" required>
                  <option value="">{t('select')}</option>
                  <option value="Yes">{t('history_chronic')}</option>
                  <option value="No">{t('no_history')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label">{t('tobacco_usage')}</label>
                <select name="smoking" value={formData.smoking} onChange={handleChange} className="input-field" required>
                  <option value="">{t('select')}</option>
                  <option value="Yes">{t('active_user')}</option>
                  <option value="No">{t('non_user')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label">{t('blood_pressure')}</label>
                <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} className="input-field" placeholder="120/80" />
              </div>
              <div className="space-y-2">
                <label className="label">{t('glucose')}</label>
                <input type="number" name="bloodSugar" value={formData.bloodSugar} onChange={handleChange} className="input-field" placeholder="95" />
              </div>
            </div>
          </div>

          {/* Section: Lifestyle */}
          <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-all">
            <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-3 tracking-tighter">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs">03</span>
              {t('lifestyle_habits')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="label">{t('diet_archetype')}</label>
                <select name="dietType" value={formData.dietType} onChange={handleChange} className="input-field" required>
                  <option value="">{t('select_diet')}</option>
                  <option value="Vegetarian">{t('vegetarian')}</option>
                  <option value="Non-Vegetarian">{t('non_vegetarian')}</option>
                  <option value="Vegan">{t('vegan')}</option>
                  <option value="Mixed">{t('mixed_balance')}</option>
                  <option value="High Protein">{t('high_protein')}</option>
                  <option value="Junk Food Frequent">{t('processed_food')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label">{t('fast_food_freq')}</label>
                <select name="fastFoodFrequency" value={formData.fastFoodFrequency} onChange={handleChange} className="input-field" required>
                  <option value="">{t('select_frequency')}</option>
                  <option value="Rare">{t('rarely')}</option>
                  <option value="Weekly">{t('once_weekly')}</option>
                  <option value="2-3 times/week">{t('two_three_weekly')}</option>
                  <option value="Daily">{t('daily_intake')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label">{t('alcohol_usage')}</label>
                <select name="alcoholConsumption" value={formData.alcoholConsumption} onChange={handleChange} className="input-field" required>
                  <option value="">{t('select')}</option>
                  <option value="Low">{t('minimal_none')}</option>
                  <option value="Moderate">{t('occasional')}</option>
                  <option value="High">{t('regular')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label">{t('weekly_exercise')}</label>
                <input type="number" name="exerciseFrequency" value={formData.exerciseFrequency} onChange={handleChange} className="input-field" required min="0" max="7" />
              </div>
              <div className="space-y-2">
                <label className="label">{t('physical_intensity')}</label>
                <select name="physicalActivity" value={formData.physicalActivity} onChange={handleChange} className="input-field" required>
                  <option value="">{t('select')}</option>
                  <option value="Sedentary">{t('sedentary')}</option>
                  <option value="Light">{t('light')}</option>
                  <option value="Moderate">{t('gym_active')}</option>
                  <option value="Intense">{t('intense')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label">{t('subjective_stress')}</label>
                <input type="number" name="stressLevel" value={formData.stressLevel} onChange={handleChange} className="input-field" required min="1" max="10" />
              </div>
              <div className="space-y-2">
                <label className="label">{t('avg_sleep_hrs')}</label>
                <input type="number" name="sleepHours" value={formData.sleepHours} onChange={handleChange} className="input-field" required step="0.5" />
              </div>
              <div className="space-y-2">
                <label className="label">{t('sleep_quality')}</label>
                <select name="sleepQuality" value={formData.sleepQuality} onChange={handleChange} className="input-field" required>
                  <option value="">{t('select')}</option>
                  <option value="Poor">{t('poor_interrupted')}</option>
                  <option value="Moderate">{t('moderate')}</option>
                  <option value="Good">{t('good_restful')}</option>
                  <option value="Excellent">{t('excellent_deep')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label">{t('working_hours_daily')}</label>
                <input type="number" name="workingHours" value={formData.workingHours} onChange={handleChange} className="input-field" required min="0" max="24" />
              </div>
              <div className="space-y-2">
                <label className="label">{t('screen_time_daily')}</label>
                <input type="number" name="screenTime" value={formData.screenTime} onChange={handleChange} className="input-field" required min="0" max="24" />
              </div>
              <div className="space-y-2">
                <label className="label">{t('water_intake_daily')}</label>
                <input type="number" name="waterIntake" value={formData.waterIntake} onChange={handleChange} className="input-field" required step="0.1" min="0" />
              </div>
            </div>
          </div>

          {/* Section: Occupation & Connectivity */}
          <div className="bg-white border-2 border-gray-100 rounded-[2.5rem] p-10 shadow-sm hover:shadow-xl transition-all">
            <h2 className="text-2xl font-black text-black mb-8 flex items-center gap-3 tracking-tighter">
              <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-xs">04</span>
              {t('occupational_context')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="label">{t('occupational_archetype')}</label>
                <select name="workType" value={formData.workType} onChange={handleChange} className="input-field" required>
                  <option value="">{t('select_archetype')}</option>
                  <option value="Student">{t('student_research')}</option>
                  <option value="Office">{t('office_desk')}</option>
                  <option value="Manual">{t('manual_labor')}</option>
                  <option value="Remote">{t('remote_hybrid')}</option>
                  <option value="Business">{t('business_leadership')}</option>
                  <option value="Freelancer">{t('independent_freelance')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label">{t('circadian_protocol')}</label>
                <select name="nightShift" value={formData.nightShift} onChange={handleChange} className="input-field" required>
                  <option value="">{t('select_protocol')}</option>
                  <option value="No">{t('diurnal_rhythm')}</option>
                  <option value="Yes">{t('nocturnal_rhythm')}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="label">{t('biometric_wearable')}</label>
                <select name="useSmartwatch" value={formData.useSmartwatch} onChange={handleChange} className="input-field" required>
                  <option value="">{t('select_status')}</option>
                  <option value="Yes">{t('active_wearable')}</option>
                  <option value="No">{t('inactive_wearable')}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-6 text-xl tracking-tighter"
            >
              {loading ? <LoadingSpinner /> : t('generate_audit')}
            </button>
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-6">
              {t('encrypted_transmission')}
            </p>
          </div>
        </form>
      </div >
    </div >
  )
}

export default AssessmentPage
