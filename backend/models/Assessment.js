import mongoose from 'mongoose';

const AssessmentSchema = new mongoose.Schema({
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
    index: true
  },

  // Basic Info
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

  // Health History
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

  // Medical
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

  // 🧑‍💼 Work
  occupation: {
    type: String
  },
  workType: {
    type: String,
    required: [true, "Occupational archetype required"],
    enum: {
      values: ['Student', 'Office', 'Manual', 'Remote', 'Business', 'Freelancer'],
      message: "{VALUE} is not a valid occupational archetype"
    }
  },
  nightShift: {
    type: String,
    required: [true, "Circadian protocol (Night Shift) status required"],
    enum: {
      values: ['Yes', 'No'],
      message: "{VALUE} is not a valid shift status"
    }
  },
  workStress: {
    type: Number,
    min: 1,
    max: 10
  },

  // ⌚ Wearable
  useSmartwatch: {
    type: String,
    enum: ['Yes', 'No']
  },
  dailySteps: {
    type: Number
  },
  avgHeartRate: {
    type: Number
  },

  // 🥗 Diet
  dietType: {
    type: String,
    enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Mixed', 'High Protein', 'Junk Food Frequent']
  },
  fastFoodFrequency: {
    type: String,
    enum: ['Rare', 'Weekly', '2-3 times/week', 'Daily']
  },
  junkFood: {
    type: Number
  },
  waterIntake: {
    type: Number
  },
  screenTime: {
    type: Number
  },
  sleepQuality: {
    type: String,
    enum: ['Poor', 'Moderate', 'Good', 'Excellent']
  },
  physicalActivity: {
    type: String,
    enum: ['Sedentary', 'Light', 'Moderate', 'Intense']
  },
  fruitVeg: {
    type: Number
  },

  // Risk
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },

  riskLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'High']
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

  aiSuggestion: {
    type: String
  }
}, { timestamps: true });

export default mongoose.model('Assessment', AssessmentSchema);
