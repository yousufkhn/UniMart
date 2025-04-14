import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const LocationSelector = ({
  selectedLocation,
  onSelectLocation,
}: {
  selectedLocation: string;
  onSelectLocation: (location: string) => void;
}) => {
  const [customLocation, setCustomLocation] = useState("");

  const handlePresetSelect = (location: string) => {
    setCustomLocation(""); // Clear custom input when a preset is selected
    onSelectLocation(location);
  };

  const handleCustomInput = (text: string) => {
    onSelectLocation(text); // Update the selected location
    setCustomLocation(text); // Update the custom input
  };

  return (
    <View style={styles.locationSelectorContainer}>
      {/* First Row: LPU Campus and Law Gate */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.presetOption,
            selectedLocation === "LPU Campus" && styles.selectedOption, // Highlight if selected
          ]}
          onPress={() => handlePresetSelect("LPU Campus")}
        >
          <Text style={styles.presetOptionText}>LPU Campus 🎓</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.presetOption,
            selectedLocation === "Law Gate" && styles.selectedOption, // Highlight if selected
          ]}
          onPress={() => handlePresetSelect("Law Gate")}
        >
          <Text style={styles.presetOptionText}>Law Gate ⚖️</Text>
        </TouchableOpacity>
      </View>

      {/* Second Row: Phagwara and Deepnagar */}
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.presetOption,
            selectedLocation === "Phagwara" && styles.selectedOption, // Highlight if selected
          ]}
          onPress={() => handlePresetSelect("Phagwara")}
        >
          <Text style={styles.presetOptionText}>Phagwara 🏬</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.presetOption,
            selectedLocation === "Deepnagar" && styles.selectedOption, // Highlight if selected
          ]}
          onPress={() => handlePresetSelect("Deepnagar")}
        >
          <Text style={styles.presetOptionText}>DeepNagar 🛖</Text>
        </TouchableOpacity>
      </View>

      {/* Third Row: Custom Location Input */}
      <TextInput
        style={[
          styles.customInput,
          customLocation && styles.selectedOption, // Highlight if custom input is active
        ]}
        placeholder="Canada? 🇨🇦"
        placeholderTextColor={"grey"}
        value={customLocation}
        onChangeText={handleCustomInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  locationSelectorContainer: {
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  presetOption: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#2a2b2f", // Darker border for options
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#202126", // Dark background for options
  },
  selectedOption: {
    borderColor: "#209440", // Green accent for selected option
    backgroundColor: "#18161b", // Slightly darker background for selected option
  },
  presetOptionText: {
    fontSize: 14,
    color: "#cccccc", // Light gray text for options
  },
  customInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#2a2b2f", // Darker border for input
    borderRadius: 8,
    backgroundColor: "#202126", // Dark background for input
    fontSize: 14,
    color: "#ffffff", // White text for input
    marginHorizontal: 5,
  },
});

export default LocationSelector;