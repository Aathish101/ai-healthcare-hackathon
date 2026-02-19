import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: { type: String, required: true },
  age: Number,
  gender: String,
  relation: String,
  imageUrl: String
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);
