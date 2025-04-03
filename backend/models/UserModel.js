import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    regNo: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store for API calls
    name: { type: String, required: true }, // Student Name
    profilePic: { type: String }, // Profile Picture URL
    program: { type: String }, // Course Program
    section: { type: String }, // Section
    rollNumber: { type: String }, // Roll Number
    cgpa: { type: String }, // CGPA
    attendance: { type: String }, // Attendance Percentage
    pendingFee: { type: String }, // Pending Fee Amount
    dob: { type: String }, // Date of Birth
    passwordExpiry: { type: String }, // Password Expiry Date (if available)
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
