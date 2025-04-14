import { View, Text, Button, Image, StyleSheet, TouchableOpacity, ScrollViewBase, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useSessionStore } from "@/utils/useSessionStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useSessionStore();


  const infoCards = [
    { title: "Program", value: user.program },
    { title: "Section", value: user.section },
    { title: "Roll Number", value: user.rollNumber },
    { title: "CGPA", value: user.cgpa },
    { title: "Attendance", value: `${user.attendance}%` },
    { title: "Pending Fee", value: `₹${user.pendingFee}` },
    { title: "Date of Birth", value: user.encryptedDob },
    { title: "Password Expiry", value: user.passwordExpiry },
  ];

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user.studentPicture }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{user.studentName}</Text>
        <Text style={styles.regNo}>{user.reg_no}</Text>
      </View>

      <View style={styles.cardContainer}>
        {infoCards.map((item, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardValue}>{item.value || "—"}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={async () => {
        router.replace("/login");
        await logout();
      }}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#121212", // dark theme
    flex: 1,
  },
  centered: {
    flex: 1,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
  },
  profileImage: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderColor: "#209440",
    borderWidth: 2,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  regNo: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
  },
  cardContainer: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 4,
  },
  cardValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#209440",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});