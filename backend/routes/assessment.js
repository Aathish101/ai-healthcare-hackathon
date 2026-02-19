import express from "express";
import Assessment from "../models/Assessment.js";

const router = express.Router();

// Submit Assessment
router.post("/submit", async (req, res) => {
  const { profileId, answers } = req.body;

  let score = 0;

  if (answers.smoking === "yes") score += 3;
  if (answers.exercise === "no") score += 2;
  if (answers.stress === "high") score += 2;

  let riskLevel = "Low";
  if (score > 3) riskLevel = "Medium";
  if (score > 6) riskLevel = "High";

  const newAssessment = new Assessment({
    profileId,
    answers,
    score,
    riskLevel,
  });

  await newAssessment.save();
  res.json(newAssessment);
});

// Get assessments of profile
router.get("/:profileId", async (req, res) => {
  const data = await Assessment.find({ profileId: req.params.profileId });
  res.json(data);
});

export default router;
    