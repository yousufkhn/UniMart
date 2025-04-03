import AsyncStorage from "@react-native-async-storage/async-storage";

// Save user session
export const saveSession = async (userData: any) => {
  await AsyncStorage.setItem("userSession", JSON.stringify(userData));
};

// Get user session
export const getSession = async () => {
    const session = await AsyncStorage.getItem("userSession");
    console.log("Stored Session:", session); // Debugging
    return session ? JSON.parse(session) : null;
};

// Logout (Clear session)
export const clearSession = async () => {
  await AsyncStorage.removeItem("userSession");
};
