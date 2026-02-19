import express from "express";
import Profile from "../models/Profile.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer storage to /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"), false);
    }
  },
});

// Create Profile with Image Upload
router.post("/create", upload.single("image"), async (req, res, next) => {
  try {
    const { userId, name, age, gender, relation } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ success: false, message: "Identification and Name required." });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newProfile = new Profile({
      userId,
      name,
      age: age ? parseInt(age) : null,
      gender,
      relation,
      imageUrl
    });

    await newProfile.save();
    res.status(201).json({
      success: true,
      data: newProfile
    });
  } catch (error) {
    console.error("Profile Creation Error:", error);
    res.status(500).json({ success: false, message: error.message || "Failed to initialize profile." });
  }
});

// Get Profiles of User
router.get("/:userId", async (req, res, next) => {
  try {
    const profiles = await Profile.find({ userId: req.params.userId });
    res.json({
      success: true,
      data: profiles
    });
  } catch (error) {
    next(error);
  }
});

// DELETE Profile - Simplified & Reliable
router.delete("/:id", async (req, res) => {
  try {
    console.log("Deleting profile:", req.params.id)

    const deletedProfile = await Profile.findByIdAndDelete(req.params.id)

    if (!deletedProfile) {
      return res.status(404).json({ message: "Profile not found" })
    }

    res.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    res.status(500).json({ message: "Server delete error" })
  }
})

export default router;
