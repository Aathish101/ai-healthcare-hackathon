/**
 * Risk Engine Service
 * AI-inspired weighted scoring algorithm for health risk prediction
 * Calculates risk scores for: Diabetes, Heart Disease, Hypertension, Obesity, Stress
 */

/**
 * Main function to calculate all health risks
 * @param {AssessmentModel} assessment - Health assessment data
 * @returns {Object} Risk analysis results
 */
export function calculateHealthRisks(assessment) {
  const risks = {
    diabetes: calculateDiabetesRisk(assessment),
    heartDisease: calculateHeartDiseaseRisk(assessment),
    hypertension: calculateHypertensionRisk(assessment),
    obesity: calculateObesityRisk(assessment),
    stress: calculateStressRisk(assessment)
  };

  // Calculate overall health score (inverse of average risk)
  const averageRisk = Object.values(risks).reduce((sum, risk) => sum + risk.percentage, 0) / 5;
  const overallHealthScore = Math.round(100 - averageRisk);

  // Generate personalized recommendations
  const recommendations = generateRecommendations(assessment, risks);

  // Calculate confidence score based on data completeness
  const confidenceScore = calculateConfidenceScore(assessment);

  return {
    risks,
    overallHealthScore,
    recommendations,
    confidenceScore
  };
}

/**
 * Calculate Diabetes Risk
 * Factors: Age, BMI, Family History, Blood Sugar, Exercise, Diet
 */
function calculateDiabetesRisk(assessment) {
  let score = 0;

  // Age factor (30-65 higher risk)
  if (assessment.age >= 30 && assessment.age <= 65) {
    score += 15;
  } else if (assessment.age > 65) {
    score += 20;
  }

  // BMI factor
  if (assessment.bmi) {
    if (assessment.bmi >= 30) score += 25;
    else if (assessment.bmi >= 25) score += 15;
    else if (assessment.bmi < 18.5) score += 5;
  }

  // Family history
  if (assessment.familyHistory === 'Yes') score += 20;

  // Blood sugar (if provided)
  if (assessment.bloodSugar) {
    if (assessment.bloodSugar >= 126) score += 30;
    else if (assessment.bloodSugar >= 100) score += 15;
  }

  // Exercise factor (inverse)
  if (assessment.exerciseFrequency < 2) score += 15;
  else if (assessment.exerciseFrequency >= 5) score -= 10;

  // Alcohol consumption
  if (assessment.alcoholConsumption === 'High') score += 10;

  // Normalize to 0-100
  score = Math.max(0, Math.min(100, score));

  return {
    percentage: Math.round(score),
    category: getRiskCategory(score),
    disease: 'Diabetes'
  };
}

/**
 * Calculate Heart Disease Risk
 * Factors: Age, Gender, Smoking, Blood Pressure, Cholesterol (inferred), Exercise, BMI
 */
function calculateHeartDiseaseRisk(assessment) {
  let score = 0;

  // Age factor
  if (assessment.age >= 45) score += 20;
  if (assessment.age >= 55) score += 10;

  // Gender factor (males higher risk)
  if (assessment.gender === 'Male') score += 10;

  // Smoking (major risk factor)
  if (assessment.smoking === 'Yes') score += 30;

  // Blood pressure
  if (assessment.bloodPressure) {
    const [systolic, diastolic] = assessment.bloodPressure.split('/').map(Number);
    if (systolic >= 140 || diastolic >= 90) score += 25;
    else if (systolic >= 130 || diastolic >= 85) score += 15;
  }

  // BMI
  if (assessment.bmi) {
    if (assessment.bmi >= 30) score += 20;
    else if (assessment.bmi >= 25) score += 10;
  }

  // Exercise (protective factor)
  if (assessment.exerciseFrequency < 2) score += 15;
  else if (assessment.exerciseFrequency >= 5) score -= 10;

  // Family history
  if (assessment.familyHistory === 'Yes') score += 15;

  // Alcohol (moderate may be protective, high is risk)
  if (assessment.alcoholConsumption === 'High') score += 10;

  score = Math.max(0, Math.min(100, score));

  return {
    percentage: Math.round(score),
    category: getRiskCategory(score),
    disease: 'Heart Disease'
  };
}

/**
 * Calculate Hypertension Risk
 * Factors: Age, BMI, Blood Pressure, Salt (inferred from diet), Exercise, Stress
 */
function calculateHypertensionRisk(assessment) {
  let score = 0;

  // Age factor
  if (assessment.age >= 40) score += 15;
  if (assessment.age >= 60) score += 10;

  // BMI (strong correlation)
  if (assessment.bmi) {
    if (assessment.bmi >= 30) score += 25;
    else if (assessment.bmi >= 25) score += 15;
  }

  // Blood pressure (if already high)
  if (assessment.bloodPressure) {
    const [systolic, diastolic] = assessment.bloodPressure.split('/').map(Number);
    if (systolic >= 140 || diastolic >= 90) score += 30;
    else if (systolic >= 130 || diastolic >= 85) score += 20;
  }

  // Exercise
  if (assessment.exerciseFrequency < 2) score += 15;
  else if (assessment.exerciseFrequency >= 5) score -= 10;

  // Stress level
  if (assessment.stressLevel >= 7) score += 15;
  else if (assessment.stressLevel >= 5) score += 8;

  // Family history
  if (assessment.familyHistory === 'Yes') score += 12;

  // Alcohol
  if (assessment.alcoholConsumption === 'High') score += 10;

  score = Math.max(0, Math.min(100, score));

  return {
    percentage: Math.round(score),
    category: getRiskCategory(score),
    disease: 'Hypertension'
  };
}

/**
 * Calculate Obesity Risk
 * Factors: BMI, Exercise, Age, Sleep
 */
function calculateObesityRisk(assessment) {
  let score = 0;

  // BMI is primary factor
  if (assessment.bmi) {
    if (assessment.bmi >= 30) score = 85; // Obese
    else if (assessment.bmi >= 25) score = 60; // Overweight
    else if (assessment.bmi >= 23) score = 30; // At risk
    else if (assessment.bmi < 18.5) score = 15; // Underweight
    else score = 10; // Normal
  } else {
    // Estimate from height/weight if BMI not calculated
    if (assessment.height && assessment.weight) {
      const estimatedBMI = assessment.weight / Math.pow(assessment.height / 100, 2);
      if (estimatedBMI >= 30) score = 85;
      else if (estimatedBMI >= 25) score = 60;
      else if (estimatedBMI >= 23) score = 30;
      else score = 10;
    }
  }

  // Exercise (major modifier)
  if (assessment.exerciseFrequency < 2) score += 15;
  else if (assessment.exerciseFrequency >= 5) score -= 20;

  // Sleep (poor sleep linked to obesity)
  if (assessment.sleepHours < 6) score += 10;
  else if (assessment.sleepHours >= 8) score -= 5;

  // Age (metabolism slows)
  if (assessment.age >= 40) score += 5;

  score = Math.max(0, Math.min(100, score));

  return {
    percentage: Math.round(score),
    category: getRiskCategory(score),
    disease: 'Obesity'
  };
}

/**
 * Calculate Stress Disorder Risk
 * Factors: Stress Level, Sleep, Exercise, Age, Work-life balance (inferred)
 */
function calculateStressRisk(assessment) {
  let score = 0;

  // Stress level (primary factor)
  score += assessment.stressLevel * 8; // 1-10 scale -> 8-80 points

  // Sleep (poor sleep increases stress)
  if (assessment.sleepHours < 6) score += 15;
  else if (assessment.sleepHours < 7) score += 8;
  else if (assessment.sleepHours >= 8) score -= 10;

  // Exercise (protective)
  if (assessment.exerciseFrequency < 2) score += 15;
  else if (assessment.exerciseFrequency >= 5) score -= 15;

  // Age (younger adults may have higher stress)
  if (assessment.age >= 18 && assessment.age <= 35) score += 5;

  // Alcohol (can increase stress)
  if (assessment.alcoholConsumption === 'High') score += 10;

  score = Math.max(0, Math.min(100, score));

  return {
    percentage: Math.round(score),
    category: getRiskCategory(score),
    disease: 'Stress Disorder'
  };
}

/**
 * Get risk category from percentage
 */
function getRiskCategory(percentage) {
  if (percentage < 30) return 'Low';
  if (percentage < 60) return 'Moderate';
  return 'High';
}

/**
 * Generate personalized recommendations based on risks
 */
function generateRecommendations(assessment, risks) {
  const recommendations = [];

  // High risk areas
  const highRisks = Object.entries(risks)
    .filter(([_, risk]) => risk.category === 'High')
    .map(([key, _]) => key);

  // Diabetes recommendations
  if (risks.diabetes.category === 'High' || risks.diabetes.category === 'Moderate') {
    recommendations.push({
      priority: 'high',
      category: 'Diabetes',
      suggestions: [
        'Monitor blood sugar levels regularly',
        'Maintain a balanced diet with low glycemic index foods',
        'Engage in at least 150 minutes of moderate exercise per week',
        'Maintain healthy body weight',
        'Consider annual diabetes screening'
      ]
    });
  }

  // Heart disease recommendations
  if (risks.heartDisease.category === 'High' || risks.heartDisease.category === 'Moderate') {
    const suggestions = [
      'Quit smoking immediately if you smoke',
      'Maintain healthy blood pressure levels',
      'Follow a heart-healthy diet (Mediterranean or DASH diet)',
      'Engage in regular cardiovascular exercise'
    ];
    if (assessment.smoking === 'Yes') {
      suggestions.unshift('🚨 Quit smoking - this is the most critical step');
    }
    recommendations.push({
      priority: 'high',
      category: 'Heart Disease',
      suggestions
    });
  }

  // Hypertension recommendations
  if (risks.hypertension.category === 'High' || risks.hypertension.category === 'Moderate') {
    recommendations.push({
      priority: 'high',
      category: 'Hypertension',
      suggestions: [
        'Reduce sodium intake to less than 2,300mg per day',
        'Maintain healthy weight',
        'Engage in regular physical activity',
        'Limit alcohol consumption',
        'Practice stress management techniques',
        'Monitor blood pressure regularly'
      ]
    });
  }

  // Obesity recommendations
  if (risks.obesity.category === 'High' || risks.obesity.category === 'Moderate') {
    recommendations.push({
      priority: 'high',
      category: 'Obesity',
      suggestions: [
        'Create a sustainable calorie deficit diet',
        'Increase physical activity gradually',
        'Aim for 7-9 hours of quality sleep',
        'Consider consulting a nutritionist',
        'Set realistic weight loss goals (1-2 lbs per week)'
      ]
    });
  }

  // Stress recommendations
  if (risks.stress.category === 'High' || risks.stress.category === 'Moderate') {
    recommendations.push({
      priority: 'high',
      category: 'Stress Management',
      suggestions: [
        'Practice mindfulness and meditation',
        'Ensure adequate sleep (7-9 hours)',
        'Engage in regular physical activity',
        'Consider therapy or counseling if stress is overwhelming',
        'Take regular breaks and practice work-life balance',
        'Limit caffeine and alcohol intake'
      ]
    });
  }

  // General health recommendations
  if (assessment.exerciseFrequency < 3) {
    recommendations.push({
      priority: 'medium',
      category: 'Exercise',
      suggestions: [
        'Aim for at least 150 minutes of moderate exercise per week',
        'Start with 10-15 minutes daily and gradually increase',
        'Find activities you enjoy to maintain consistency'
      ]
    });
  }

  if (assessment.sleepHours < 7) {
    recommendations.push({
      priority: 'medium',
      category: 'Sleep',
      suggestions: [
        'Aim for 7-9 hours of sleep per night',
        'Maintain a consistent sleep schedule',
        'Create a relaxing bedtime routine',
        'Limit screen time before bed'
      ]
    });
  }

  // If all risks are low, provide maintenance recommendations
  if (highRisks.length === 0 && Object.values(risks).every(r => r.category === 'Low')) {
    recommendations.push({
      priority: 'low',
      category: 'Maintenance',
      suggestions: [
        'Continue maintaining your healthy lifestyle',
        'Schedule annual health checkups',
        'Stay active and maintain current exercise routine',
        'Keep monitoring your health indicators'
      ]
    });
  }

  return recommendations;
}

/**
 * Calculate confidence score based on data completeness
 */
function calculateConfidenceScore(assessment) {
  let completeness = 0;
  const totalFields = 12;

  if (assessment.age) completeness++;
  if (assessment.gender) completeness++;
  if (assessment.height) completeness++;
  if (assessment.weight) completeness++;
  if (assessment.bmi) completeness++;
  if (assessment.familyHistory) completeness++;
  if (assessment.smoking) completeness++;
  if (assessment.alcoholConsumption) completeness++;
  if (assessment.exerciseFrequency !== undefined) completeness++;
  if (assessment.bloodPressure) completeness++;
  if (assessment.bloodSugar) completeness++;
  if (assessment.stressLevel) completeness++;
  if (assessment.sleepHours) completeness++;

  // Bonus for critical medical data
  if (assessment.bloodPressure) completeness += 0.5;
  if (assessment.bloodSugar) completeness += 0.5;

  const score = Math.min(100, Math.round((completeness / totalFields) * 100));
  return score;
}

