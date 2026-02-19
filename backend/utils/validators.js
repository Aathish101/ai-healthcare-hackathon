import { body, validationResult } from 'express-validator';

/**
 * Validation middleware for assessment data
 */
export const validateAssessment = [
  // Age validation
  body('age')
    .isInt({ min: 1, max: 120 })
    .withMessage('Age must be between 1 and 120'),

  // Gender validation
  body('gender')
    .isIn(['Male', 'Female', 'Other'])
    .withMessage('Gender must be Male, Female, or Other'),

  // Height validation (in cm)
  body('height')
    .optional()
    .isFloat({ min: 100, max: 250 })
    .withMessage('Height must be between 100 and 250 cm'),

  // Weight validation (in kg)
  body('weight')
    .optional()
    .isFloat({ min: 20, max: 300 })
    .withMessage('Weight must be between 20 and 300 kg'),

  // BMI validation
  body('bmi')
    .optional()
    .isFloat({ min: 10, max: 60 })
    .withMessage('BMI must be between 10 and 60'),

  // Family history validation
  body('familyHistory')
    .isIn(['Yes', 'No'])
    .withMessage('Family history must be Yes or No'),

  // Smoking validation
  body('smoking')
    .isIn(['Yes', 'No'])
    .withMessage('Smoking status must be Yes or No'),

  // Alcohol consumption validation
  body('alcoholConsumption')
    .isIn(['Low', 'Moderate', 'High'])
    .withMessage('Alcohol consumption must be Low, Moderate, or High'),

  // Exercise frequency validation
  body('exerciseFrequency')
    .isInt({ min: 0, max: 7 })
    .withMessage('Exercise frequency must be between 0 and 7 days per week'),

  // Blood pressure validation (format: "systolic/diastolic")
  body('bloodPressure')
    .optional()
    .matches(/^\d{2,3}\/\d{2,3}$/)
    .withMessage('Blood pressure must be in format "systolic/diastolic" (e.g., "120/80")'),

  // Blood sugar validation
  body('bloodSugar')
    .optional()
    .isFloat({ min: 50, max: 500 })
    .withMessage('Blood sugar must be between 50 and 500 mg/dL'),

  // Stress level validation
  body('stressLevel')
    .isInt({ min: 1, max: 10 })
    .withMessage('Stress level must be between 1 and 10'),

  // Sleep hours validation
  body('sleepHours')
    .isFloat({ min: 0, max: 24 })
    .withMessage('Sleep hours must be between 0 and 24'),

  // Occupational validation
  body('workType')
    .isIn(['Student', 'Office', 'Manual', 'Remote', 'Business', 'Freelancer'])
    .withMessage('Invalid occupational archetype'),

  body('nightShift')
    .isIn(['Yes', 'No'])
    .withMessage('Night shift status must be Yes or No'),

  // Device validation
  body('useSmartwatch')
    .optional()
    .isIn(['Yes', 'No'])
    .withMessage('Smartwatch status must be Yes or No'),

  // Diet Type validation
  body('dietType')
    .optional()
    .isIn(['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Mixed', 'High Protein', 'Junk Food Frequent'])
    .withMessage('Invalid Diet Type'),

  // Fast Food Frequency validation
  body('fastFoodFrequency')
    .optional()
    .isIn(['Rare', 'Weekly', '2-3 times/week', 'Daily'])
    .withMessage('Invalid Fast Food Frequency'),

  // Working Hours validation
  body('workingHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Working hours must be between 0 and 24'),

  // Screen Time validation
  body('screenTime')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Screen time must be between 0 and 24'),

  // Water Intake validation
  body('waterIntake')
    .optional()
    .isFloat({ min: 0, max: 20 })
    .withMessage('Water intake must be between 0 and 20 liters'),

  // Sleep Quality validation
  body('sleepQuality')
    .optional()
    .isIn(['Poor', 'Moderate', 'Good', 'Excellent'])
    .withMessage('Invalid Sleep Quality'),

  // Physical Activity validation
  body('physicalActivity')
    .optional()
    .isIn(['Sedentary', 'Light', 'Moderate', 'Intense'])
    .withMessage('Invalid Physical Activity Intensity'),

  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

