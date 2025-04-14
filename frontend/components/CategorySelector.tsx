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
  // const [isModalVisible, setModalVisible] = useState(false);
  // const [customCategory, setCustomCategory] = useState("");

  const handleSelectCategory = (category: string) => {
    onCategorySelect(category);
    // setModalVisible(false);
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
    <View style={styles.container}>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {predefinedCategories.map((category) => (
          <View key={category.name} style={styles.categoryWrapper}>
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory === category.name && styles.selectedCategory, // Highlight selected category
              ]}
              onPress={() => onCategorySelect(category.name)}
            >
              <Image
                source={typeof category.image === "string" ? { uri: category.image } : category.image}
                style={styles.categoryImage}
              />
            </TouchableOpacity>
            <Text style={styles.categoryText}>{category.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default CategorySelector;


const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff", // White text for dark theme
    marginBottom: 5,
  },
  scrollContainer: {
    // paddingHorizontal: 10,
  },
  categoryWrapper: {
    alignItems: "center",
    borderRadius: 8, // Rounded corners for consistency
    marginHorizontal: 5,
    // backgroundColor: "#202126", // Dark background for category wrapper
    padding: 5,
  },
  categoryItem: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#18161b", // Darker background for category items
    width: 60,
    height: 60,
    padding: 10,
    borderRadius: 8, // Rounded corners for category items
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: "#209440", // Green accent for selected category
  },
  categoryImage: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#cccccc", // Light gray text for category names
    textAlign: "center",
    marginTop: 5,
  },
});