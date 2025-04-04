import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface CategorySelectorProps {
  predefinedCategories: { name: string; image: string }[]; // List of predefined categories
  selectedCategory: string; // Currently selected category
  onCategorySelect: (category: string) => void; // Callback when a category is selected
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  predefinedCategories,
  selectedCategory,
  onCategorySelect,
}) => {
  const [isModalVisible, setModalVisible] = useState(false);
  // const [customCategory, setCustomCategory] = useState("");

  const handleSelectCategory = (category: string) => {
    onCategorySelect(category);
    setModalVisible(false);
  };

  // const handleAddCustomCategory = () => {
  //   if (!customCategory.trim()) {
  //     Alert.alert("Error", "Category name cannot be empty.");
  //     return;
  //   }

  //   if (predefinedCategories.some((category) => category.name === customCategory.trim())) {
  //     Alert.alert("Error", "Category already exists.");
  //     return;
  //   }

  //   onCategorySelect(customCategory.trim());
  //   setCustomCategory("");
  //   setModalVisible(false);
  // };

  return (
    <View>
      {/* Category Selector Button */}
      <TouchableOpacity
        style={styles.categorySelector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.categorySelectorText}>{selectedCategory || "Select a category"}</Text>
      </TouchableOpacity>

      {/* Modal for Category Selection */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>

        
          <View style={styles.modalContent}>

          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                    <Icon name="close" size={30} color="black" />
                  </TouchableOpacity>
          <View style={styles.scrollContent}>
            
            <Text style={styles.title}>Select a Category</Text>

            {/* Predefined Categories */}
            <FlatList
              showsVerticalScrollIndicator={false}
              data={predefinedCategories}
              keyExtractor={(item) => item.name}
              numColumns={2} // Display categories in a grid
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryCard}
                  onPress={() => handleSelectCategory(item.name)}
                >
                  <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.categoryImage} />
                  <Text style={styles.categoryText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Custom Category Input
            <TextInput
              style={styles.input}
              placeholder="Add custom category"
              value={customCategory}
              onChangeText={setCustomCategory}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddCustomCategory}
            >
              <Text style={styles.addButtonText}>Add Category</Text>
            </TouchableOpacity> */}

            {/* Close Button */}
            {/* <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity> */}
            
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategorySelector;

const styles = StyleSheet.create({
  categorySelector: {
    borderWidth: 0, // Remove the border for a cleaner look
    borderRadius: 12, // Larger border radius for a pill-shaped button
    paddingVertical: 15, // Add vertical padding for better height
    paddingHorizontal: 25, // Add horizontal padding for better width
    marginBottom: 20,
    backgroundColor: "#007bff", // Fallback background color
    alignItems: "center",
    justifyContent: "center", // Center the text vertically
    shadowColor: "#000", // Add shadow for a card-like effect
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Elevation for Android shadow
  },
  categorySelectorText: {
    fontSize: 16, // Slightly larger font size for better readability
    fontWeight: "600", // Semi-bold for a clean look
    color: "#fff", // White text for contrast
    textTransform: "uppercase", // Make the text uppercase for a modern feel
    letterSpacing: 1, // Add letter spacing for a polished look
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    height:"80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  scrollContent: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  categoryCard: {
    width: "45%", // Each card takes 45% of the row width
    margin: "2.5%", // Add spacing between cards
    backgroundColor: "#ffffff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 120, // Fixed height for the card
  },
  categoryImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
    resizeMode: "contain", // Ensure the image fits within the bounds
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    position: "absolute",
      top: 20,
      right: 20,
  },
  closeButtonText: {
      position: "absolute",
      top: 10,
      right: 10,
  },
});