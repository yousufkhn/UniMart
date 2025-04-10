import { Stack } from "expo-router";

export default function ProductLayout() {
  return (
    <Stack>
      {/* Define the product index screen */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}