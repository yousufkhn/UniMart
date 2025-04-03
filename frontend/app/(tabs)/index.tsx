import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import "../globals.css";
import Icon from "react-native-vector-icons/Ionicons";
import { useSessionStore } from "@/utils/useSessionStore";
import AnnouncementCard from "../../components/AnnoucementCard";

export default function Index() {
  const { user } = useSessionStore();

  return (
    <View style={styles.container}>
      {/* Top Row: Profile Picture, Title, and Settings Button */}
      <View style={styles.topBar}>
        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: user?.studentPicture }} style={styles.image} resizeMode="cover" />
        </View>

        {/* Title */}
        <Text style={styles.title}>UniMart</Text>

        {/* Settings Button */}
        <TouchableOpacity style={styles.button}>
          <Icon name="settings-outline" size={24} color="#004CFF" />
        </TouchableOpacity>
      </View>

      {/* Greeting Message */}
      <Text style={styles.greeting}>Hello, {user?.studentName?.split(" ")[0]}!</Text>
      

      {/* More content will be added here later */}
      <AnnouncementCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
    borderColor: "#e5ebfc",
    backgroundColor: "#e5ebfc",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 29,
    backgroundColor: "#e5ebfc",
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    marginTop: 15,
  },
});
