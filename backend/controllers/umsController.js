import axios from "axios";
import User from "../models/UserModel.js";

export const umsLogin = async (req, res) => {
  const { reg_no, password } = req.body;

  // Validate input
  if (!reg_no || !password) {
    return res.status(400).json({ error: "Registration number and password are required." });
  }

  try {
    // Fetch Student Basic Info Directly
    const response = await axios.post(
      "https://findmyverto-dndxdgfsezc0gben.centralindia-01.azurewebsites.net/api/v2/student/basicInfo",
      {
        reg_no: reg_no,
        password: password,
        devicePushToken: "",
      }
    );

    const data = response.data;
    console.log("Response from UMS API:", data); // Log the response for debugging
    console.log("Request Payload:", { reg_no, password });

    if (!data.success) {
      return res.status(401).json({ error: "Invalid credentials or API failure" });
    }

    // Extract Student Data
    const studentInfo = {
      ...data.data 
    };

    console.log("This is studentInfo variable :",studentInfo)

    let user = await User.findOne({ reg_no: studentInfo.reg_no });

    // Upsert User in MongoDB
    if (!user) {
      // If the user does not exist, create a new user
      user = new User({
        reg_no: studentInfo.reg_no,
        password: password,
        studentName: studentInfo.studentName || "User",
        studentPicture: studentInfo.studentPicture || "",
        program: studentInfo.program || "",
        section: studentInfo.section || "",
        rollNumber: studentInfo.rollNumber || "",
        cgpa: studentInfo.cgpa || "",
        attendance: studentInfo.attendance || "",
        pendingFee: studentInfo.pendingFee || "",
        encryptedDob: studentInfo.encryptedDob || "",
        // passwordExpiry: passwordExpiry,
      });
    } else {
      // If the user exists, update the necessary fields
      user.password = password;
      user.studentName = studentInfo.studentName || user.studentName;
      user.studentPicture = studentInfo.studentPicture || user.studentPicture;
      user.program = studentInfo.program || user.program;
      user.section = studentInfo.section || user.section;
      user.rollNumber = studentInfo.rollNumber || user.rollNumber;
      user.cgpa = studentInfo.cgpa || user.cgpa;
      user.attendance = studentInfo.attendance || user.attendance;
      user.pendingFee = studentInfo.pendingFee || user.pendingFee;
      user.encryptedDob = studentInfo.encryptedDob || user.encryptedDob;
      // user.passwordExpiry = passwordExpiry || user.passwordExpiry;
    }

    await user.save();
    console.log("User saved:", user); // Log the saved user for debugging

    return res.status(200).json({
      message: "Login & Fetch Successful",
      user,
    });

  } catch (error) {
    console.error("Error fetching student details:", error.message || error);
    return res.status(500).json({ error: "Server error while fetching details" });
  }
};
  