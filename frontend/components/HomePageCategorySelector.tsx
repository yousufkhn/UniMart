import React, { useEffect, useRef, useState } from "react";
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
import * as Haptics from "expo-haptics";

interface CategorySelectorProps {
  predefinedCategories: { name: string; image: string }[]; // List of predefined categories
  selectedCategory: string; // Currently selected category
  onCategorySelect: (category: string) => void; // Callback when a category is selected
}

const HomePageCategorySelector: React.FC<CategorySelectorProps> = ({
  predefinedCategories,
  selectedCategory,
  onCategorySelect,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const categoryWidths = useRef<number[]>([]); // Store widths of each category

  const handleSelectCategory = (category: string, index: number) => {
    Haptics.selectionAsync(); // Trigger haptic feedback immediately
    onCategorySelect(category);
    // setModalVisible(false);

    scrollViewRef.current?.scrollTo({
        x: index * 55, // Adjust the multiplier (100) to scroll more or less
        animated: true,
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {predefinedCategories.map((category, index) => {
          const isSelected = selectedCategory === category.name;
          return (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.categoryWrapper,
                isSelected && styles.selectedCategoryWrapper, // Apply underline to the entire category
              ]}
              onPress={() => handleSelectCategory(category.name, index)}
              onLayout={(event) => {
                // Capture the width of each category
                const { width } = event.nativeEvent.layout;
                categoryWidths.current[index] = width;
              }}
            >
              <Image
                source={
                  typeof category.image === "string"
                    ? { uri: category.image }
                    : category.image
                }
                style={styles.categoryImage}
              />
              {/* <View style={[isSelected && styles.selectedCategoryWrapper]}> */}
              <Text style={[styles.categoryText]}>{category.name}</Text>
              {/* </View> */}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HomePageCategorySelector;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  categoryWrapper: {
    alignItems: "center",
    marginHorizontal: 10,
    borderBottomWidth: 2,
    borderColor: "#2a2b2f",
  },
  categoryItem: {
    padding: 5,
    marginBottom: 4,
  },
  selectedCategoryWrapper: {
    borderBottomWidth: 3,
    borderColor: "#00C853", // Green underline (Zomato style)
    borderRadius: 0,
  },
  categoryImage: {
    width: 35,
    height: 35,
    resizeMode: "cover",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
    marginTop: 4,
  },
});
