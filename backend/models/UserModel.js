import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    reg_no: { type: String, required: true, unique: true }, // Students registration number
    program: { type: String }, // Course Program
    section: { type: String }, // Section
    studentName: { type: String, required: true }, // Student Name
    studentPicture: { type: String }, // Profile Picture URL
    password: { type: String, required: true }, // Store for API calls
    rollNumber: { type: String }, // Roll Number
    cgpa: { type: String }, // CGPA
    attendance: { type: String }, // Attendance Percentage
    pendingFee: { type: String }, // Pending Fee Amount
    dataofBirth: { type: String }, // Date of Birth
    encryptedDob: { type: String }, // Encrypted Date of Birth
    passwordExpiry: { type: String }, // Password Expiry Date (if available)
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
