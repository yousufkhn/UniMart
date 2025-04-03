import axios from "axios";
import User from "../models/UserModel.js";

export const umsLogin = async (req, res) => {
  const { regNo, password } = req.body;

  try {
    // Fetch Student Basic Info Directly
    const response = await axios.post(
      "https://findmyverto-dndxdgfsezc0gben.centralindia-01.azurewebsites.net/api/v2/student/basicInfo",
      {
        reg_no: regNo,
        password: password,
        devicePushToken: "", // Can be empty or optional
      }
    );

    const data = response.data;

    if (!data.success) {
      return res.status(401).json({ error: "Invalid credentials or API failure" });
    }

    // Extract Student Data
    const studentInfo = data.data;
    const passwordExpiry = data.passwordExpiry || null;

    // Check if user already exists
    let user = await User.findOne({ regNo });

    if (!user) {
      user = new User({
        regNo,
        password,
        name: studentInfo.studentName || "Unknown",
        profilePic: studentInfo.studentPicture || "",
        program: studentInfo.program || "",
        section: studentInfo.section || "",
        rollNumber: studentInfo.rollNumber || "",
        cgpa: studentInfo.cgpa || "",
        attendance: studentInfo.attendance || "",
        pendingFee: studentInfo.pendingFee || "",
        dob: studentInfo.encryptedDob || "",
        passwordExpiry,
      });
    } else {
      // Update existing user details
      user.password = password;
      user.name = studentInfo.studentName || user.name;
      user.profilePic = studentInfo.studentPicture || user.profilePic;
      user.program = studentInfo.program || user.program;
      user.section = studentInfo.section || user.section;
      user.rollNumber = studentInfo.rollNumber || user.rollNumber;
      user.cgpa = studentInfo.cgpa || user.cgpa;
      user.attendance = studentInfo.attendance || user.attendance;
      user.pendingFee = studentInfo.pendingFee || user.pendingFee;
      user.dob = studentInfo.encryptedDob || user.dob;
      user.passwordExpiry = passwordExpiry;
    }

    await user.save();

    return res.status(200).json({
      message: "Login & Fetch Successful",
      studentInfo,
    });

  } catch (error) {
    console.error("Error fetching student details:", error.message || error);
    return res.status(500).json({ error: "Server error while fetching details" });
  }
};
