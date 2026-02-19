import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female', 'Other']
  },
  height: {
    type: Number
  },
  weight: {
    type: Number
  },
  bmi: {
    type: Number
  },
  familyHistory: {
    type: String,
    required: true,
    enum: ['Yes', 'No']
  },
  smoking: {
    type: String,
    required: true,
    enum: ['Yes', 'No']
  },
  alcoholConsumption: {
    type: String,
    required: true,
    enum: ['Low', 'Moderate', 'High']
  },
  exerciseFrequency: {
    type: Number,
    required: true,
    min: 0,
    max: 7
  },
  bloodPressure: {
    type: String
  },
  bloodSugar: {
    type: Number
  },
  stressLevel: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  sleepHours: {
    type: Number,
    required: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  risks: {
    diabetes: {
      percentage: Number,
      category: String
    },
    heartDisease: {
      percentage: Number,
      category: String
    },
    hypertension: {
      percentage: Number,
      category: String
    },
    obesity: {
      percentage: Number,
      category: String
    },
    stress: {
      percentage: Number,
      category: String
    }
  },
  recommendations: [{
    priority: String,
    category: String,
    suggestions: [String]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Assessment', AssessmentSchema);

