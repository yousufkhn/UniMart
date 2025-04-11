import { Stack, Slot, useRouter, useSegments } from "expo-router";
import { useEffect} from "react";
import { useSessionStore } from "@/utils/useSessionStore";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading, initializeSession } = useSessionStore();

  useEffect(() => {
    const checkLogin = async () => {
      await initializeSession(); // Initialize session from Zustand store
      const { user } = useSessionStore.getState(); // Get updated user state
      console.log("Initialized user:", user); // Debugging
      if (!user && segments[0] !== "login") {
        router.replace("/login"); // Redirect to login if no user is found
      }
    };
    checkLogin();
  }, [segments]);

  if (isLoading) return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#209440" />
      </View>
  );

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Slot /> {/* 👈 Ensures nested pages render correctly */}
    </Stack>
  );
}
