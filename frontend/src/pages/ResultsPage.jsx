import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import jsPDF from 'jspdf'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const ResultsPage = () => {
  const navigate = useNavigate()
  const [results, setResults] = useState(null)

  useEffect(() => {
    const storedResults = sessionStorage.getItem('assessmentResults')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    } else {
      navigate('/assessment')
    }
  }, [navigate])

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
      </div>
    )
  }

  const { risks, overallHealthScore, recommendations, confidenceScore, assessment } = results

  // Prepare chart data
  const chartData = {
    labels: Object.values(risks).map(r => r.disease),
    datasets: [
      {
        label: 'Risk Percentage',
        data: Object.values(risks).map(r => r.percentage),
        backgroundColor: Object.values(risks).map(r => {
          if (r.category === 'High') return 'rgba(239, 68, 68, 0.8)'
          if (r.category === 'Moderate') return 'rgba(251, 191, 36, 0.8)'
          return 'rgba(34, 197, 94, 0.8)'
        }),
        borderColor: Object.values(risks).map(r => {
          if (r.category === 'High') return 'rgb(239, 68, 68)'
          if (r.category === 'Moderate') return 'rgb(251, 191, 36)'
          return 'rgb(34, 197, 94)'
        }),
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Health Risk Assessment Results',
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const risk = Object.values(risks)[context.dataIndex]
            return `${risk.disease}: ${risk.percentage}% (${risk.category} Risk)`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%'
          }
        }
      }
    }
  }

  const downloadPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPos = 20

    // Header
    doc.setFontSize(20)
    doc.setTextColor(37, 99, 235)
    doc.text('Ayurevia Health Risk Assessment Report', pageWidth / 2, yPos, { align: 'center' })
    yPos += 10

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated: ${new Date(assessment.timestamp).toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' })
    yPos += 15

    // Overall Health Score
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 0)
    doc.text('Overall Health Score', 20, yPos)
    yPos += 8
    doc.setFontSize(24)
    doc.setTextColor(37, 99, 235)
    doc.text(`${overallHealthScore}/100`, 20, yPos)
    yPos += 10

    // Confidence Score
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text(`Confidence Score: ${confidenceScore}%`, 20, yPos)
    yPos += 15

    // Risk Breakdown
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Risk Breakdown:', 20, yPos)
    yPos += 8

    Object.values(risks).forEach(risk => {
      if (yPos > pageHeight - 30) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.text(`${risk.disease}: ${risk.percentage}% (${risk.category} Risk)`, 25, yPos)
      yPos += 7
    })

    yPos += 5

    // Recommendations
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(14)
    doc.text('Personalized Recommendations:', 20, yPos)
    yPos += 8

    recommendations.forEach(rec => {
      if (yPos > pageHeight - 30) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(11)
      doc.setTextColor(37, 99, 235)
      doc.text(`${rec.category}:`, 25, yPos)
      yPos += 6

      rec.suggestions.forEach(suggestion => {
        if (yPos > pageHeight - 20) {
          doc.addPage()
          yPos = 20
        }
        doc.setFontSize(10)
        doc.setTextColor(0, 0, 0)
        doc.text(`• ${suggestion}`, 30, yPos)
        yPos += 6
      })
      yPos += 3
    })

    // Disclaimer
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }

    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(
      'Disclaimer: This assessment is for informational purposes only and should not replace professional medical advice. Please consult with healthcare professionals for medical decisions.',
      20,
      yPos,
      { maxWidth: pageWidth - 40, align: 'justify' }
    )

    doc.save(`Ayurevia-Health-Report-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const getHealthScoreColor = (score) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getHealthScoreBg = (score) => {
    if (score >= 70) return 'bg-green-100'
    if (score >= 50) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Health Assessment Results</h1>
          <p className="text-xl text-gray-600">
            Generated on {new Date(assessment.timestamp).toLocaleString()}
          </p>
        </div>

        {/* Overall Health Score */}
        <div className="card mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overall Health Score</h2>
            <div className={`inline-flex items-center justify-center w-48 h-48 rounded-full ${getHealthScoreBg(overallHealthScore)} mb-4`}>
              <div className="text-center">
                <div className={`text-6xl font-bold ${getHealthScoreColor(overallHealthScore)}`}>
                  {overallHealthScore}
                </div>
                <div className="text-gray-600 text-sm mt-2">out of 100</div>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Confidence Score: <span className="font-semibold">{confidenceScore}%</span>
            </p>
            <p className="text-sm text-gray-500">
              Based on comprehensive analysis of your health indicators
            </p>
          </div>
        </div>

        {/* Risk Breakdown Chart */}
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Risk Breakdown</h2>
          <div className="h-96">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Detailed Risk Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.values(risks).map((risk, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{risk.disease}</h3>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Risk Level</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    risk.category === 'High' ? 'bg-red-100 text-red-800' :
                    risk.category === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {risk.category}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      risk.category === 'High' ? 'bg-red-500' :
                      risk.category === 'Moderate' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${risk.percentage}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm text-gray-600 mt-1">
                  {risk.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personalized Recommendations</h2>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="border-l-4 border-medical-blue pl-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {rec.category}
                  <span className={`ml-2 text-xs px-2 py-1 rounded ${
                    rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {rec.priority.toUpperCase()} PRIORITY
                  </span>
                </h3>
                <ul className="space-y-2">
                  {rec.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-gray-700 flex items-start">
                      <span className="text-medical-blue mr-2">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={downloadPDF}
            className="btn-primary"
          >
            Download PDF Report
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary bg-green-600 hover:bg-green-700"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/assessment')}
            className="btn-secondary"
          >
            Take Another Assessment
          </button>
        </div>

        {/* Disclaimer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Disclaimer</h3>
          <p className="text-sm text-yellow-800">
            This health risk assessment is provided for informational and educational purposes only. 
            It is not intended to diagnose, treat, cure, or prevent any disease. The results are based 
            on statistical models and should not replace professional medical advice, diagnosis, or treatment. 
            Always seek the advice of qualified health providers with any questions you may have regarding 
            a medical condition. Never disregard professional medical advice or delay in seeking it because 
            of something you have read in this assessment.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResultsPage

