import { calculateHealthRisks } from '../services/riskEngine.js';
import Assessment from '../models/Assessment.js';

/**
 * CREATE ASSESSMENT
 */
export const createAssessment = async (req, res) => {
  try {
    const { profileId } = req.body;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Profile ID is required'
      });
    }

    // Clone request body
    const assessmentData = { ...req.body };

    // 🔹 AUTO BMI CALCULATION
    if (assessmentData.height && assessmentData.weight) {
      const h = parseFloat(assessmentData.height) / 100;
      const w = parseFloat(assessmentData.weight);

      if (h > 0) {
        assessmentData.bmi = parseFloat((w / (h * h)).toFixed(1));
      }
    }

    // 🔹 CALCULATE RISKS
    const riskResults = calculateHealthRisks(assessmentData);

    // 🔹 DETERMINE RISK LEVEL
    let riskLevel = 'Low';

    if (riskResults.overallHealthScore <= 20) {
      riskLevel = 'High';
    } else if (riskResults.overallHealthScore <= 60) {
      riskLevel = 'Moderate';
    }

    // 🔹 BUILD AI SUMMARY
    const aiSuggestion = riskResults.recommendations
      ?.map(rec => `${rec.category}: ${rec.suggestions?.[0] || ''}`)
      .join('. ') || '';

    // 🔹 CREATE & SAVE DOCUMENT
    const savedAssessment = await Assessment.create({
      ...assessmentData,
      riskScore: riskResults.overallHealthScore,
      riskLevel,
      risks: riskResults.risks,
      recommendations: riskResults.recommendations,
      aiSuggestion
    });

    // ✅ RETURN FULL DOCUMENT (IMPORTANT FOR PDF)
    res.status(201).json({
      success: true,
      data: savedAssessment
    });

  } catch (error) {
    console.error('Assessment creation error:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error during assessment processing'
    });
  }
};


/**
 * GET ALL ASSESSMENTS FOR A PROFILE
 */
export const getUserAssessments = async (req, res, next) => {
  try {
    const { profileId } = req.params;

    if (!profileId) {
      return res.status(400).json({
        success: false,
        message: 'Profile ID is required'
      });
    }

    const assessments = await Assessment.find({ profileId })
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
 * DELETE ASSESSMENT
 */
export const deleteAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleted = await Assessment.findByIdAndDelete(id);

    if (!deleted) {
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
