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
} from "react-native";
import { Stack, useRouter } from "expo-router";
import axios from "axios";
import { saveSession } from "@/utils/auth";
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
      const response = await axios.post(
        "https://findmyverto-dndxdgfsezc0gben.centralindia-01.azurewebsites.net/api/v2/student/basicInfo",
        // "https://chubby-files-bow.loca.lt/api/auth/ums-login",
        {
          reg_no: regNo,
          password,
          devicePushToken: "",
        }
      );

      const data = response.data as {
        success: boolean;
        data: { name: string; reg_no: string };
      };

      if (data.success) {
        // await saveSession(data.data);
        // router.replace("/(tabs)/profile");
        const { setUser } = useSessionStore.getState();
        setUser(data.data); // Update Zustand store
        await saveSession(data.data); // Save session to AsyncStorage
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
        className="w-full h-1/3 mb-2"
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
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff8ee",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 30,
  },
  subTitle: {
    fontSize: 12, // Smaller than the main title
    color: "#6B7280", // Soft gray for a subtle look
    marginBottom: 10, // Adds spacing before the input fields
    fontWeight: "500", // Medium weight for readability
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#004CFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disclaimerBox: {
    marginTop: 20,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  disclaimerText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
});
