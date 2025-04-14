import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

interface SortOptionsProps {
  options: string[]; // Array of sorting options
  selectedOption: string; // Currently selected sorting option
  onOptionSelect: (option: string) => void; // Callback when an option is selected
}

const SortOptions: React.FC<SortOptionsProps> = ({
  options,
  selectedOption,
  onOptionSelect,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      <View style={styles.container}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              selectedOption === option && styles.selectedOption, // Highlight selected option
            ]}
            onPress={() => onOptionSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.selectedOptionText, // Highlight selected text
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default SortOptions;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 10,
  },
  container: {
    flexDirection: "row",
    flexWrap: "wrap", // Allow options to wrap into two rows
    justifyContent: "flex-start",
  },
  option: {
    borderWidth: 0.5, // Thinner border
    borderColor: "#2a2b2f", // Light gray border
    borderRadius: 10, // Less border radius
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 5,
    backgroundColor: "#202126", // Slightly lighter background
  },
  selectedOption: {
    borderColor: "#209440", // Green border for selected option
    backgroundColor: "#202126", // Slightly darker background for selected option
  },
  optionText: {
    fontSize: 14,
    color: "#cccccc", // Light gray text
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "white",
  },
});