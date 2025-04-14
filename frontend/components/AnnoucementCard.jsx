import { View, Text, TouchableOpacity, StyleSheet, TouchableHighlight } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useState } from "react";
import { TouchableOpacityBase } from "react-native";

export default function AnnouncementCard() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null; // Hide the card when dismissed

  return (
    <TouchableOpacity style={styles.container}>
      {/* Text Content */}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>🚀 Exciting News!</Text>
        <Text style={styles.message}>
          Our app is still in development, so you might encounter a few bugs.
          You're among the first testers! Help us improve by uploading as many items as you can. 
        </Text>
      </View>

      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
        <Icon name="close" size={20} color="gray" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20, // Adjust this to position above the navigation bar
    left: 16,
    right: 16,
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
  },
  message: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
});
