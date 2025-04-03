import { View, Text, Button, Image } from "react-native";
import { useRouter } from "expo-router";
import { useSessionStore } from "@/utils/useSessionStore";


interface User {
  studentName: string;
  reg_no: string;
  email?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useSessionStore();

  // console.log("User object:", user);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Image
        source={{ uri: user.studentPicture}}
        style={{ width: 200, height: 200, borderRadius: 100, marginBottom: 20 }}
      />
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        {user.studentName}
      </Text>
      <Text style={{ fontSize: 16, color: "gray", marginBottom: 20 }}>
        {user.program || "Course not specified"}
      </Text>
      <Button
        title="Logout"
        onPress={async () => {
          await logout();
          router.replace("/login");
        }}
      />
    </View>
  );
}
