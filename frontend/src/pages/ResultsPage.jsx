import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  AreaChart,
  Area,
  LabelList
} from 'recharts'
import jsPDF from 'jspdf'
import axios from 'axios'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/LoadingSpinner'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'

const ResultsPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [results, setResults] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedResults = sessionStorage.getItem('assessmentResults')
        if (!storedResults) {
          navigate('/assessment')
          return
        }

        const currentData = JSON.parse(storedResults)
        if (!currentData || !currentData.risks) {
          throw new Error('Invalid assessment data found')
        }
        setResults(currentData)

        const pid = sessionStorage.getItem('selectedProfileId')
        if (pid) {
          const response = await api.get(`/api/assessment/${pid}`)
        }
      } catch (error) {
        console.error('Error fetching results data:', error)
        toast.error('Unable to load full results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const getRiskColor = (score) => {
    if (score <= 20) return "bg-red-500 text-white"
    if (score <= 60) return "bg-yellow-400 text-black"
    return "bg-green-500 text-white"
  }

  if (loading || !results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    )
  }

  const risks = results.risks || {}
  const overallHealthScore = results.riskScore || 0
  const recommendations = results.recommendations || []
  const assessment = results
  const confidenceScore = 100   // or calculate if needed

  const formatDiseaseName = (name) => {
    if (!name) return 'Unknown'
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  }

  const riskBarData = risks
    ? Object.entries(risks).map(([key, r]) => ({
      name: formatDiseaseName(r.disease || key),
      value: Number(r.percentage) || 0,
      category: r.category || 'Unknown',
      color: r.category === 'High' ? '#ef4444' : r.category === 'Moderate' ? '#facc15' : '#22c55e'
    }))
    : []

  const trendData = Array.isArray(history) ? history.map(item => ({
    date: item.createdAt ? new Date(item.createdAt).toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric'
    }) : 'Unknown',
    risk: Number(item.riskScore) || 0
  })) : []

  const downloadPDF = () => {
    if (!results || !assessment) return
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPos = 20

    doc.setFontSize(24)
    doc.setTextColor(0, 0, 0)
    doc.text('MEDICAL AUDIT REPORT', pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    doc.setFontSize(10)
    doc.setTextColor(150, 150, 150)
    doc.text(`ID: ${results._id} | GENERATED ON ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += 20

    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`OVERALL INTEGRITY SCORE: ${overallHealthScore}/100`, 20, yPos)
    yPos += 15

    doc.text('RISK ANALYSIS:', 20, yPos)
    yPos += 10
    doc.setFontSize(10)
    Object.values(risks).forEach(risk => {
      doc.text(`- ${risk.disease.toUpperCase()}: ${risk.percentage}% (${risk.category.toUpperCase()})`, 25, yPos)
      yPos += 7
    })

    yPos += 10
    doc.setFontSize(12)
    doc.text('ADVISORY:', 20, yPos)
    yPos += 8
    recommendations.forEach(rec => {
      doc.setFontSize(10)
      doc.text(`${rec.category.toUpperCase()} (${rec.priority.toUpperCase()} PRIORITY)`, 25, yPos)
      yPos += 6
      rec.suggestions.forEach(s => {
        doc.text(`• ${s}`, 30, yPos)
        yPos += 6
      })
      yPos += 4
    })

    doc.save(`Medical_Audit_${new Date().toISOString()}.pdf`)
  }

  return (
    <div className="min-h-screen py-16 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <span className="inline-block px-4 py-1.5 mb-4 text-[10px] font-black tracking-[0.3em] text-white uppercase bg-black rounded-full">
            {t('diagnostic_outcome')}
          </span>
          <h1 className="text-6xl font-black text-black mb-6 tracking-tighter">
            {t('integrity_results')}
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            {t('subject')}: {sessionStorage.getItem('selectedProfileName')} • {new Date(assessment?.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 animate-slide-in">
          <div className="md:col-span-2 bg-black text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">{t('aggregate_health_index')}</h3>
                <div className="text-9xl font-black tracking-tighter mb-4">{overallHealthScore}</div>
                <div className="flex items-center gap-4">
                  <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getRiskColor(overallHealthScore)}`}>
                    {overallHealthScore <= 20 ? t('critical_observation') :
                      overallHealthScore <= 60 ? t('cautionary') :
                        t('optimal_status')}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{t('confidence')}: {confidenceScore}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border-2 border-gray-100 p-10 rounded-[3rem] shadow-sm flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
              <span className="text-2xl font-black text-black">{sessionStorage.getItem('selectedProfileName')?.charAt(0)}</span>
            </div>
            <h4 className="text-lg font-black text-black mb-1">{sessionStorage.getItem('selectedProfileName')}</h4>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">{t('profile_snapshot')}</p>
            <button
              onClick={() => {
                const data = JSON.parse(sessionStorage.getItem("assessmentResults"));

                if (!data?._id) {
                  alert("No report available");
                  return;
                }

                // If you want backend PDF route:
                window.open(
  `${import.meta.env.VITE_API_BASE_URL}/api/assessment/pdf/${data._id}`,
  "_blank"
);
                // OR if using jsPDF local download:
                // downloadPDF()
              }}
              className="btn-primary"
            >
              {t('download_pdf_audit')}
            </button>

          </div>
        </div>

        <div className="bg-white border-2 border-gray-100 rounded-[3rem] p-10 mb-12 shadow-sm">
          <h3 className="text-xl font-black text-black mb-10 tracking-tighter">{t('variance_risk_indicators')}</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskBarData} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  tick={({ x, y, payload }) => (
                    <text x={x} y={y + 15} textAnchor="middle" fill="#9ca3af" fontSize={10} fontWeight={700}>
                      {payload.value.toUpperCase()}
                    </text>
                  )}
                />
                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }} />
                <Tooltip
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#000', color: '#fff' }}
                />
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

        <div className="space-y-6 mb-12">
          <h3 className="text-3xl font-black text-black tracking-tighter mb-8">{t('personalized_advisory')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="bg-white border-2 border-gray-100 p-8 rounded-3xl hover:border-black transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-lg font-black text-black uppercase tracking-tighter">{rec.category}</h4>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${rec.priority === 'high' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {rec.priority}
                  </span>
                </div>
                <ul className="space-y-4">
                  {rec.suggestions.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-4 text-sm font-medium text-gray-500 group-hover:text-black transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 shrink-0"></span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <button onClick={() => navigate('/dashboard')} className="btn-primary px-12 py-5 text-sm uppercase tracking-widest">
            {t('back_to_dashboard')}
          </button>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-3xl p-8 flex gap-6 items-start">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-gray-100">
            <span className="text-xl font-bold">⚠️</span>
          </div>
          <div>
            <h5 className="text-sm font-black text-black uppercase tracking-widest mb-2">{t('notice_intent')}</h5>
            <p className="text-xs text-gray-400 font-medium leading-relaxed">
              {t('disclaimer_text')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage
