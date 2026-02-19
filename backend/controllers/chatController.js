import { GoogleGenerativeAI } from "@google/generative-ai";
import Assessment from "../models/Assessment.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Chat Controller - Gemini Version
 */
export const chatWithAI = async (req, res) => {
  try {
    const { userId, question } = req.body;

    if (!userId || !question) {
      return res.status(400).json({
        success: false,
        message: "User ID and question are required",
      });
    }

    // Get latest assessment
    const latestAssessment = await Assessment.findOne({ userId })
      .sort({ createdAt: -1 });

    let contextPrompt = "";

    if (latestAssessment) {
      contextPrompt = `
User's latest health assessment data:
- Age: ${latestAssessment.age}
- Gender: ${latestAssessment.gender}
- BMI: ${latestAssessment.bmi || "Not provided"}
- Risk Score: ${latestAssessment.riskScore}/100
- Exercise Frequency: ${latestAssessment.exerciseFrequency} days/week
- Stress Level: ${latestAssessment.stressLevel}/10
- Sleep Hours: ${latestAssessment.sleepHours} hours
- Family History: ${latestAssessment.familyHistory}
- Smoking: ${latestAssessment.smoking}
- Alcohol Consumption: ${latestAssessment.alcoholConsumption}

Risk Breakdown:
- Diabetes Risk: ${latestAssessment.risks.diabetes.percentage}% (${latestAssessment.risks.diabetes.category})
- Heart Disease Risk: ${latestAssessment.risks.heartDisease.percentage}% (${latestAssessment.risks.heartDisease.category})
- Hypertension Risk: ${latestAssessment.risks.hypertension.percentage}% (${latestAssessment.risks.hypertension.category})
- Obesity Risk: ${latestAssessment.risks.obesity.percentage}% (${latestAssessment.risks.obesity.category})
- Stress Risk: ${latestAssessment.risks.stress.percentage}% (${latestAssessment.risks.stress.category})
`;
    }

    const finalPrompt = `
You are a professional health assistant for Aurevia Health.
Provide helpful, accurate, and personalized health advice.
Always remind users to consult healthcare professionals.
Be empathetic and actionable.

${contextPrompt}

User Question:
${question}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({
      success: true,
      data: {
        answer: text,
      },
    });

  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get AI response. Please try again.",
    });
  }
};

