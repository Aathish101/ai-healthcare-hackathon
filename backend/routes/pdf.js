import express from "express";
import PDFDocument from "pdfkit";
import Assessment from "../models/Assessment.js";

const router = express.Router();

router.get("/download/:id", async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=health_audit_${assessment._id}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text("Aurevia Health Audit Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Risk Score: ${assessment.riskScore}`);
    doc.text(`Risk Level: ${assessment.riskLevel}`);
    doc.text(`BMI: ${assessment.bmi}`);
    doc.text(`Age: ${assessment.age}`);
    doc.text(`Gender: ${assessment.gender}`);
    doc.text(`Exercise Frequency: ${assessment.exerciseFrequency}`);
    doc.text(`Sleep Hours: ${assessment.sleepHours}`);
    doc.text(`Stress Level: ${assessment.stressLevel}`);

    doc.end();

  } catch (error) {
    console.error("PDF error:", error);
    res.status(500).json({ message: "PDF generation failed" });
  }
});

export default router;
