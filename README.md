# PreventAI – Early Health Risk Prediction Platform

A production-ready, full-stack AI-powered preventive healthcare web application that predicts early risk of lifestyle diseases (Diabetes, Hypertension, Heart Disease, Obesity, Stress Disorders) using user-provided health indicators and provides personalized recommendations.

## 🚀 Features

- **Early Risk Detection**: Predict risk for 5 major lifestyle diseases
- **AI-Powered Analysis**: Advanced weighted scoring algorithms
- **Personalized Recommendations**: Tailored health suggestions based on risk profile
- **Interactive Visualizations**: Chart.js-powered risk breakdown charts
- **PDF Report Generation**: Download detailed health assessment reports
- **Professional UI**: Modern, responsive medical-themed design
- **Real-time BMI Calculation**: Automatic BMI calculation from height and weight
- **Comprehensive Validation**: Client and server-side input validation

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Chart.js** for data visualization
- **jsPDF** for PDF generation

### Backend
- **Node.js** with Express.js
- **RESTful API** architecture
- **MVC Pattern** (Models, Views, Controllers)
- **Express Validator** for input validation
- **CORS** enabled for cross-origin requests

## 📁 Project Structure

```
AI Health Care/
├── backend/
│   ├── controllers/
│   │   ├── assessmentController.js
│   │   └── healthController.js
│   ├── models/
│   │   └── AssessmentModel.js
│   ├── routes/
│   │   ├── assessmentRoutes.js
│   │   └── healthRoutes.js
│   ├── services/
│   │   └── riskEngine.js          # AI risk scoring engine
│   ├── utils/
│   │   └── validators.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Icons.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── AssessmentPage.jsx
│   │   │   └── ResultsPage.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🏃 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults are set):
```bash
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Health Check
```
GET /api/health
```
Returns API status and uptime.

**Response:**
```json
{
  "success": true,
  "message": "PreventAI API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

### Health Assessment
```
POST /api/assessment
```

**Request Body:**
```json
{
  "age": 35,
  "gender": "Male",
  "height": 175,
  "weight": 75,
  "bmi": 24.5,
  "familyHistory": "Yes",
  "smoking": "No",
  "alcoholConsumption": "Moderate",
  "exerciseFrequency": 3,
  "bloodPressure": "120/80",
  "bloodSugar": 95,
  "stressLevel": 5,
  "sleepHours": 7
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "assessment": { ... },
    "risks": {
      "diabetes": {
        "percentage": 25,
        "category": "Low",
        "disease": "Diabetes"
      },
      ...
    },
    "overallHealthScore": 75,
    "recommendations": [ ... ],
    "confidenceScore": 92
  }
}
```

## 🧠 Risk Scoring Engine

The risk engine uses weighted scoring algorithms to calculate risk percentages for each disease category:

### Diabetes Risk Factors
- Age (30-65: higher risk)
- BMI (≥30: high risk)
- Family history (+20 points)
- Blood sugar levels
- Exercise frequency (inverse correlation)
- Alcohol consumption

### Heart Disease Risk Factors
- Age (45+: higher risk)
- Gender (males: +10 points)
- Smoking status (major risk: +30 points)
- Blood pressure
- BMI
- Exercise frequency
- Family history

### Hypertension Risk Factors
- Age (40+: higher risk)
- BMI (strong correlation)
- Blood pressure (if already elevated)
- Exercise frequency
- Stress level
- Family history

### Obesity Risk Factors
- BMI (primary factor)
- Exercise frequency
- Sleep hours
- Age

### Stress Disorder Risk Factors
- Stress level (1-10 scale)
- Sleep hours
- Exercise frequency
- Age
- Alcohol consumption

### Risk Categories
- **Low**: 0-29%
- **Moderate**: 30-59%
- **High**: 60-100%

## 🎨 Design Features

- **Medical Theme**: Blue/white color scheme
- **Responsive Design**: Mobile-first approach
- **Smooth Transitions**: CSS transitions for better UX
- **Professional Typography**: Inter font family
- **Accessibility**: Semantic HTML and ARIA labels

## 🔒 Security & Validation

- Input validation on both client and server
- CORS configuration for secure API access
- Error handling with meaningful messages
- Data sanitization and type checking

## 📊 Features Breakdown

### Landing Page
- Hero section with CTA
- About PreventAI section
- Features showcase
- Benefits list
- Call-to-action sections

### Assessment Page
- Comprehensive health form
- Real-time BMI calculation
- Form validation
- Loading states
- Error handling

### Results Page
- Overall health score visualization
- Risk breakdown bar chart
- Individual risk cards
- Personalized recommendations
- PDF download functionality
- Health disclaimer

## 🚧 Future Improvements

- [ ] User authentication and profiles
- [ ] Historical data tracking
- [ ] Integration with wearable devices
- [ ] Machine learning model integration
- [ ] Multi-language support
- [ ] Email report delivery
- [ ] Health goal setting and tracking
- [ ] Doctor consultation booking
- [ ] Medication reminders
- [ ] Community health insights

## 📝 Notes

- The risk scoring algorithm is based on established medical research and statistical models
- Results are for informational purposes only and should not replace professional medical advice
- Always consult healthcare professionals for medical decisions
- The system is designed to be a preventive tool, not a diagnostic tool

## 🤝 Contributing

This is a production-ready project structure. To extend:

1. Add new risk factors in `backend/services/riskEngine.js`
2. Extend the assessment model in `backend/models/AssessmentModel.js`
3. Add new UI components in `frontend/src/components/`
4. Create new pages in `frontend/src/pages/`

## 📄 License

This project is created for educational and demonstration purposes.

## 👨‍💻 Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

## 🐛 Troubleshooting

### Backend Issues
- Ensure port 5000 is not in use
- Check that all dependencies are installed
- Verify `.env` file configuration

### Frontend Issues
- Clear browser cache
- Check that backend is running
- Verify API endpoint URLs in `AssessmentPage.jsx`

### CORS Issues
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Check CORS configuration in `server.js`

## 📞 Support

For issues or questions, please check:
- API health endpoint: `GET /api/health`
- Browser console for frontend errors
- Backend terminal for server logs

---

**Built with ❤️ for preventive healthcare**

