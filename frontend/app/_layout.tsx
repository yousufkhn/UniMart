import { Stack, Slot, useRouter, useSegments } from "expo-router";
import { useEffect} from "react";
import { useSessionStore } from "@/utils/useSessionStore";

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user, isLoading, initializeSession } = useSessionStore();

  useEffect(() => {
    const checkLogin = async () => {
      await initializeSession(); // Initialize session from Zustand store
      const { user } = useSessionStore.getState(); // Get updated user state
      console.log("Initialized user:", user); // Debugging
      if (!user && segments[0] !== "auth") {
        router.replace("/login"); // Redirect to login if no user is found
      }
    };

    checkLogin();
  }, [segments]);

  if (isLoading) return <Slot />;

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Slot /> {/* 👈 Ensures nested pages render correctly */}
    </Stack>
  );
}
