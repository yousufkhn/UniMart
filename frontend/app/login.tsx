import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import axios, { get } from "axios";
import { saveSession,getSession } from "@/utils/auth";
import { useSessionStore } from "@/utils/useSessionStore";

export default function LoginScreen() {
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const handleLogin = async () => {
    if (!regNo || !password) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    setLoading(true);
    try {
      // Step 1: Authenticate the user
      const response = await axios.post(
        // "https://findmyverto-dndxdgfsezc0gben.centralindia-01.azurewebsites.net/api/v2/student/basicInfo",
        "https://yourcustomsubdomain.loca.lt/api/auth/ums-login",
        {
          reg_no: regNo,
          password,
        }
      );

      console.log("API Response:", response.data); // Debugging


      const data = response.data as {
        message: string;
        user: {
          attendance: string;
          cgpa: string;
          encryptedDob: string;
          pendingFee: string;
          program: string;
          reg_no: string;
          rollNumber: string;
          section: string;
          studentName: string;
          studentPicture: string;
        };
      };

      if (data.message === "Login & Fetch Successful")  {

        // Step 2: Save session locally
        const { setUser } = useSessionStore.getState();
        setUser(data.user); // Update Zustand store
        await saveSession(data.user); // Save session to AsyncStorage

        // Step 4: Navigate to the home page
        router.replace("/(tabs)");
      } else {
        Alert.alert("Login Failed", "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Image
        source={require("../assets/images/login-img.jpg")}
        style={{ width: "100%", height: "30%", marginBottom: 10, resizeMode: "cover" }}
      />
      <Text style={styles.title}>
        {" "}
        Welcome to UniMart 🛍️{"\n"} Your Campus Marketplace!
      </Text>
      <Text style={styles.subTitle}>Login with your UMS credentials </Text>
      <TextInput
        placeholder="Registration Number"
        value={regNo}
        onChangeText={setRegNo}
        style={styles.input}
        keyboardType="numeric"
        placeholderTextColor={"#cccccc"}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        placeholderTextColor={"#cccccc"} 
      />

      {loading ? (
        <ActivityIndicator size="large" color="#004CFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}

      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimerText}>
          🔐 Why login with your university ID?{"\n"}
          Using your university credentials ensures a safe & trusted
          marketplace. It helps verify that all users are genuine students,
          making transactions secure & scam-free
        </Text>
      </View>

      {/* Modal for Lottie Animation */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
        <View style={styles.smallModalContainer}>
          <LottieView
            source={require("../assets/lottie/loading.json")} // Replace with your Lottie file
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={styles.modalText}>
            Logging in... It in might take a few tries or a bit longer than usual — depends on how the UMS server is feeling today.
          </Text>
        </View>
        </View>
      </Modal>

      
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#18161b", // Dark background
  },
  image: {
    width: "100%",
    height: "30%",
    marginBottom: 10,
    resizeMode: "cover",
    borderRadius: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff", // White text
    marginBottom: 20,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    color: "#cccccc", // Light gray text
    marginBottom: 20,
    fontWeight: "500",
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#2a2b2f", // Dark border
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#202126", // Darker input background
    color: "#ffffff", // White text
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#209440", // Green accent
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff", // White text
    fontSize: 16,
    fontWeight: "bold",
  },
  disclaimerBox: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#2a2b2f", // Dark border
    backgroundColor: "#202126", // Darker background
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  disclaimerText: {
    fontSize: 12,
    color: "#cccccc", // Light gray text
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Semi-transparent dark overlay
  },
  smallModalContainer: {
    width: "80%", // Smaller modal width
    padding: 20,
    backgroundColor: "#202126", // Matches the app's dark theme
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // Adds a subtle shadow for better visibility
  },
  lottie: {
    width: 100,
    height: 100, // Smaller Lottie animation size
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    color: "#cccccc", // Light gray text
    textAlign: "center",
  },
});