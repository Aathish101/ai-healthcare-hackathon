import { calculateHealthRisks } from '../services/riskEngine.js';
import Assessment from '../models/Assessment.js';

/**
 * Assessment Controller
 * Handles health assessment requests
 */

export const createAssessment = async (req, res, next) => {
  try {
    const { userId, ...assessmentData } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Calculate BMI if not provided
    if (!assessmentData.bmi && assessmentData.height && assessmentData.weight) {
      assessmentData.bmi = calculateBMI(assessmentData.height, assessmentData.weight);
    }

    // Create assessment model instance for risk calculation
    const assessmentModel = {
      age: assessmentData.age,
      gender: assessmentData.gender,
      height: assessmentData.height,
      weight: assessmentData.weight,
      bmi: assessmentData.bmi,
      familyHistory: assessmentData.familyHistory,
      smoking: assessmentData.smoking,
      alcoholConsumption: assessmentData.alcoholConsumption,
      exerciseFrequency: assessmentData.exerciseFrequency,
      bloodPressure: assessmentData.bloodPressure,
      bloodSugar: assessmentData.bloodSugar,
      stressLevel: assessmentData.stressLevel,
      sleepHours: assessmentData.sleepHours
    };

    // Calculate health risks using AI risk engine
    const riskResults = calculateHealthRisks(assessmentModel);

    // Create assessment document
    const assessment = new Assessment({
      userId,
      ...assessmentData,
      riskScore: riskResults.overallHealthScore,
      risks: riskResults.risks,
      recommendations: riskResults.recommendations
    });

    await assessment.save();

    // Prepare response
    const response = {
      success: true,
      data: {
        assessment: {
          id: assessment._id,
          userId: assessment.userId,
          ...assessmentData,
          riskScore: riskResults.overallHealthScore,
          timestamp: assessment.createdAt
        },
        risks: riskResults.risks,
        overallHealthScore: riskResults.overallHealthScore,
        recommendations: riskResults.recommendations,
        confidenceScore: riskResults.confidenceScore
      }
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all assessments for a user
 */
export const getUserAssessments = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const assessments = await Assessment.find({ userId })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.status(200).json({
      success: true,
      data: assessments
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an assessment
 */
export const deleteAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    const assessment = await Assessment.findOneAndDelete({
      _id: id,
      userId
    });

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Calculate BMI from height and weight
 */
function calculateBMI(height, weight) {
  if (!height || !weight || height <= 0 || weight <= 0) {
    return null;
  }
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
}
