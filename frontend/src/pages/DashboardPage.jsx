import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LabelList
} from 'recharts'
import Chatbot from '../components/Chatbot'
import LoadingSpinner from '../components/LoadingSpinner'

const DashboardPage = () => {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentProfile, setCurrentProfile] = useState(null)

  useEffect(() => {
    if (!sessionStorage.getItem('selectedProfileId')) {
      navigate('/profiles')
      return
    }
    fetchData()
  }, [user, navigate])

  const fetchData = async () => {
    try {
      const pid = sessionStorage.getItem('selectedProfileId')
      if (!pid || !user?.uid) return;

      // Fetch profile details for the image
      const profileResponse = await api.get(`/api/profiles/${user.uid}`)
      const selectedProfile = profileResponse.data.data.find(p => p._id === pid)
      setCurrentProfile(selectedProfile)

      const assessmentResponse = await api.get(`/api/assessment/${pid}`)
      setAssessments(assessmentResponse.data.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Risk Color Helper Logic
  const getRiskColor = (score) => {
    if (score <= 20) return "bg-red-500 text-white"
    if (score <= 60) return "bg-yellow-400 text-black"
    return "bg-green-500 text-white"
  }

  const handleDeleteAssessment = async (id) => {
    if (!window.confirm(t('confirm_delete_assessment'))) {
      return
    }

    try {
      await api.delete(`/api/assessment/${id}`, {
        data: { userId: user.uid }
      })
      toast.success('Assessment deleted successfully')
      fetchData()
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

  const latestAssessment =
    assessments.length > 0
      ? [...assessments].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0]
      : null;

  const chartData = assessments.map((assessment) => ({
    date: assessment.createdAt ? new Date(assessment.createdAt).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric'
    }) : 'Unknown',
    bmi: Number(assessment.bmi) || 0,
    stressLevel: Number(assessment.stressLevel) || 0,
    sleepHours: Number(assessment.sleepHours) || 0,
    risk: Number(assessment.riskScore) || 0
  }))

  const riskBarData =
    latestAssessment?.risks
      ? Object.values(latestAssessment.risks)
        .sort((a, b) => b.percentage - a.percentage)
        .map((r) => ({
          name: r.disease,
          value: Number(r.percentage),
          category: r.category,
          color:
            r.category === "High"
              ? "#ef4444"
              : r.category === "Moderate"
                ? "#facc15"
                : "#22c55e",
        }))
      : [];

  console.log("Latest Assessment:", latestAssessment);
  console.log("Risks Object:", latestAssessment?.risks);
  console.log("Risk Bar Data:", riskBarData);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-up">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-white border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
              {currentProfile?.imageUrl ? (
                <img
src={`${import.meta.env.VITE_API_BASE_URL}${currentProfile.imageUrl}`}                  alt={currentProfile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-black text-black opacity-20">{currentProfile?.name?.charAt(0)}</span>
              )}
            </div>
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1 block">{t('institutional_portal')}</span>
              <h1 className="text-4xl font-black text-black tracking-tighter uppercase leading-none">
                {currentProfile?.name} <span className="text-gray-300">/ {t('bio_data')}</span>
              </h1>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2">{t('relational_context')}: {currentProfile?.relation}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/profiles')} className="btn-secondary text-[10px] px-6">
              {t('switch_instance')}
            </button>
            <button onClick={() => navigate('/assessment')} className="btn-primary text-[10px] px-6">
              {t('initialize_audit')}
            </button>
            <button onClick={handleLogout} className="text-gray-300 hover:text-black font-black text-[10px] uppercase tracking-widest px-4 transition-colors">
              {t('terminate_session')}
            </button>
          </div>
        </div>

        {/* Diagnostic Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-black text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{t('integrity_index')}</h3>
            <div className="text-7xl font-black tracking-tighter mb-4">
              {latestAssessment ? latestAssessment.riskScore : '00'}
              <span className="text-lg opacity-30 ml-2">/ 100</span>
            </div>
            {latestAssessment && (
              <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getRiskColor(latestAssessment.riskScore)}`}>
                {latestAssessment.riskScore <= 20 ? t('critical_event') :
                  latestAssessment.riskScore <= 60 ? t('cautionary') :
                    t('optimal_status')}
              </div>
            )}
          </div>

          <div className="card">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{t('audit_cycles')}</h3>
            <div className="text-6xl font-black text-black tracking-tighter mb-2">{assessments.length}</div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{t('historical_logs')}</p>
          </div>

          <div className="card">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{t('temporal_sync')}</h3>
            <div className="text-2xl font-black text-black uppercase tracking-tighter mb-1">
              {latestAssessment ? new Date(latestAssessment.createdAt).toLocaleDateString() : 'N/A'}
            </div>
            {latestAssessment && (
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{new Date(latestAssessment.createdAt).toLocaleTimeString()}</p>
            )}
          </div>
        </div>

        {/* Analytics Distribution */}
        {assessments.length > 0 ? (
          <div className="space-y-8 mb-16">
            <div className="bg-white border-2 border-gray-100 rounded-[3.5rem] p-12 shadow-sm">
              <div className="flex justify-between items-center mb-12">
                <h3 className="text-3xl font-black text-black tracking-tighter uppercase">{t('variance_health')}</h3>
                <div className="w-12 h-1 bg-black"></div>
              </div>
              <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />

                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={80}
                      tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 900 }}
                    />

                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 900 }} />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-black text-white p-6 shadow-2xl rounded-3xl border border-white/10">
                              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-3">{label}</p>
                              <div className="flex items-center gap-4">
                                <span className="text-4xl font-black tracking-tighter">{payload[0].value}%</span>
                                <span className="text-[8px] font-black text-gray-400 uppercase leading-tight tracking-widest">{t('index_value')}</span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line type="monotone" dataKey="risk" stroke="#000000" strokeWidth={6} dot={{ r: 8, fill: '#000', strokeWidth: 4, stroke: '#fff' }} activeDot={{ r: 12, strokeWidth: 0, fill: '#000' }} animationDuration={2000} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Breakdown BarChart */}
            <div className="bg-white border-2 border-gray-100 rounded-[3.5rem] p-12 shadow-sm">
              <h3 className="text-3xl font-black text-black tracking-tighter uppercase mb-12">{t('specific_risk_vectors')}</h3>
              <div className="h-[450px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={riskBarData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 90 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={80}
                      tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 900 }}
                    />

                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 900 }} />
                    <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: '#000', color: '#fff' }} />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={56}>
                      <LabelList dataKey="value" position="top" style={{ fill: '#000', fontWeight: 900, fontSize: 12 }} />
                      {riskBarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="card">
                <h3 className="text-xl font-black text-black mb-10 tracking-tighter uppercase">{t('biometric_bmi')}</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" hide />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#9ca3af' }} />
                      <Line type="monotone" dataKey="bmi" stroke="#000000" strokeWidth={3} dot={{ r: 4, fill: '#000' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <h3 className="text-xl font-black text-black mb-10 tracking-tighter uppercase">{t('circadian_sleep_stress')}</h3>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="date" hide />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#9ca3af' }} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#000', color: '#fff' }} />
                      <Line type="monotone" dataKey="stressLevel" stroke="#374151" strokeWidth={4} dot={{ r: 0 }} name={t('stress')} />
                      <Line type="monotone" dataKey="sleepHours" stroke="#d1d5db" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 0 }} name={t('sleep')} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-[4rem] text-center p-24 mb-16 border-2 border-dashed border-gray-100">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm border border-gray-100">
              <span className="text-4xl">🛡️</span>
            </div>
            <h3 className="text-3xl font-black text-black mb-4 uppercase tracking-tighter">{t('zero_data_baseline')}</h3>
            <p className="text-gray-400 max-w-sm mx-auto mb-12 font-medium leading-relaxed uppercase text-[10px] tracking-widest">{t('zero_data_desc')}</p>
            <button onClick={() => navigate('/assessment')} className="btn-primary px-12 py-5">{t('initialize_protocol')}</button>
          </div>
        )}

        {/* Audit Logs */}
        <div className="bg-white border-2 border-gray-100 rounded-[3.5rem] overflow-hidden shadow-sm mb-20">
          <div className="p-10 border-b border-gray-50">
            <h2 className="text-3xl font-black text-black tracking-tighter uppercase leading-none text-center md:text-left">{t('longitudinal_audit_records')}</h2>
          </div>
          <div className="overflow-x-auto px-6">
            <table className="min-w-full">
              <thead>
                <tr className="bg-white">
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{t('temporal_stamp')}</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{t('vulnerability_percent')}</th>
                  <th className="px-8 py-6 text-left text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{t('bmi_vector')}</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">{t('protocol_actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assessments.map((assessment) => (
                  <tr key={assessment._id} className="group hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-black uppercase tracking-tighter">{new Date(assessment.createdAt).toLocaleDateString()}</span>
                      <span className="text-[8px] font-black text-gray-400 block uppercase tracking-widest mt-1 opacity-60">{new Date(assessment.createdAt).toLocaleTimeString()}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${getRiskColor(assessment.riskScore).split(' ')[0]}`} style={{ width: `${assessment.riskScore}%` }}></div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${getRiskColor(assessment.riskScore)}`}>
                          {assessment.riskScore}/100
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm font-black text-black uppercase tracking-tighter">{assessment.bmi || '---'}</td>
                    <td className="px-8 py-6 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          sessionStorage.setItem('assessmentResults', JSON.stringify({
                            assessment: { ...assessment, timestamp: assessment.createdAt },
                            risks: assessment.risks,
                            overallHealthScore: assessment.riskScore,
                            recommendations: assessment.recommendations,
                            confidenceScore: 95
                          }))
                          navigate('/results')
                        }}
                        className="text-black hover:opacity-100 opacity-20 font-black text-[10px] uppercase tracking-widest mr-8 transition-all"
                      >
                        {t('deep_audit')}
                      </button>
                      <button
                        onClick={() => handleDeleteAssessment(assessment._id)}
                        className="text-red-600 hover:text-red-700 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all"
                      >
                        {t('purge')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Chatbot userId={user?.uid} />
      </div>
    </div>
  )
}

export default DashboardPage
