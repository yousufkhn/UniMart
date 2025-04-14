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
  StatusBar,
  Dimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import axios, { get } from "axios";
import { saveSession, getSession } from "@/utils/auth";
import { useSessionStore } from "@/utils/useSessionStore";
import Icon from "react-native-vector-icons/Ionicons";

export default function LoginScreen() {
  const router = useRouter();
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const screenWidth = Dimensions.get("window").width;

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

      if (data.message === "Login & Fetch Successful") {
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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <StatusBar backgroundColor="#090f1c" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ImageBackground
          source={require("../assets/images/login-page-banner.png")}
          style={[styles.imageBackground, { width: screenWidth }]}
          resizeMode="cover"
        >
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)", "#18161b"]} // Add more gradient stops
            locations={[0, 0.5, 0.7, 1]}
            style={styles.gradientOverlay}
          >
            {/* <Text style={styles.title}>
              Welcome to UniMart 🛍️{"\n"}Your Campus Marketplace!
            </Text> */}

            <View style={styles.subTitleRow}>
              <Text style={styles.subTitle}>
                Login with your UMS credentials
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Icon
                  name="information-circle-outline"
                  size={16}
                  color="#ffffff"
                  style={styles.icon}
                  />
              </TouchableOpacity>
            </View>
            {/* Login Form */}
            <View style={styles.formContainer}>
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
            </View>
          </LinearGradient>
        </ImageBackground>

        {/* Disclaimer Modal */}
        <Modal
          visible={modalVisible}
          animationType="fade"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.smallModalContainer}>
              <Text style={styles.modalText}>
                🔐 Why login with your university ID?{"\n\n"}
                Using your university credentials ensures a safe & trusted
                marketplace. It helps verify that all users are genuine
                students, making transactions secure & scam-free.
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.button, { marginTop: 20 }]}
              >
                <Text style={styles.buttonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal for Login Animation */}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#18161b", // Dark background
  },
  scrollContainer: {
    flexGrow: 1,
  },
  formContainer: {
    paddingTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
    textAlign: "center",
  },
  subTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  subTitle: {
    fontSize: 14,
    color: "#cccccc",
    fontWeight: "500",
  },
  icon: {
    color: "#cccccc",
    fontSize: 16,
    marginLeft: 6,
    marginTop: 2,
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
  imageBackground: {
    height: "100%",
    justifyContent: "flex-end",
  },
  gradientOverlay: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: "flex-end",
    flex: 1,
  },
});
