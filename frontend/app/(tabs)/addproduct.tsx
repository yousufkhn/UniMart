import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinary } from "../../utils/cloudinaryUpload"; // Adjust the import path as necessary
import { useSessionStore } from "@/utils/useSessionStore";
import axios from "axios";
import CategorySelector from "@/components/CategorySelector";
import LocationSelector from "@/components/LocationSelector";
import LottieView from "lottie-react-native";

//images import
import electronicsImage from "../../assets/images/categories/electronics.png";
import fashionImage from "../../assets/images/categories/fashion.png";
import homeAppliancesImage from "../../assets/images/categories/home_appliances.png";
import booksImage from "@/assets/images/categories/books.png";
import toysImage from "@/assets/images/categories/toys.png";
import sportsImage from "@/assets/images/categories/sports.png";
import groceriesImage from "@/assets/images/categories/groceries.png";
import healthBeautyImage from "@/assets/images/categories/health_beauty.png";
import automotiveImage from "@/assets/images/categories/automotive.png";
import furnitureImage from "@/assets/images/categories/furniture.png";
import othersImage from "@/assets/images/categories/others.png";
import { router } from "expo-router";

// Predefined categories with images
const predefinedCategories = [
  { name: "Electronics", image: electronicsImage },
  { name: "Fashion", image: fashionImage },
  { name: "Home Appliances", image: homeAppliancesImage },
  { name: "Books", image: booksImage },
  { name: "Toys", image: toysImage },
  { name: "Sports", image: sportsImage },
  { name: "Groceries", image: groceriesImage },
  { name: "Health & Beauty", image: healthBeautyImage },
  { name: "Automotive", image: automotiveImage },
  { name: "Furniture", image: furnitureImage },
  { name: "Others", image: othersImage },
];

const addproduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [localImages, setLocalImages] = useState<string[]>([]); // Array of local image URIs
  const [images, setImages] = useState<string[]>([]); // Array of uploaded image URLs
  const [imagesPublicId, setImagesPublicId] = useState<string[]>([]); // Array of public IDs
  const [uploading, setUploading] = useState(false);

  // Handle Image Upload
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setLocalImages([...localImages, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = localImages.filter((_, i) => i !== index);
    setLocalImages(updatedImages);
  };

  const handleUpload = async () => {
    setUploading(true);

    // Simulate image upload (replace with your actual upload logic)
    const uploadedImages = [];
    for (const image of localImages) {
      try {
        const uploadedImage = await uploadImageToCloudinary(image); // Upload to Cloudinary
        if (uploadedImage) {
          uploadedImages.push({
            url: uploadedImage.url, // Cloudinary URL
            public_id: uploadedImage.public_id,
          });
        } else {
          throw new Error("Image upload failed"); // Explicitly throw an error if upload fails
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        Alert.alert(
          "Error",
          "One of the images failed to upload. Please try again."
        );
        setUploading(false);
        return false; // Stop the upload process and indicate failure
      }
    }
    console.log("Uploaded Images: ", uploadedImages);

    setImages(uploadedImages.map((img) => img.url));
    setImagesPublicId(uploadedImages.map((img) => img.public_id));

    return true; // Indicate success                                      
  };

  const { user } = useSessionStore(); // Assuming you have a user object in your Zustand store

  const handleSubmit = async () => {
    const uploadSuccess = await handleUpload(); // Ensure images are uploaded before submitting
    console.log("uploadSuccess : ", uploadSuccess); // Debugging
    if (!uploadSuccess) {
      Alert.alert("Error", "Image upload failed. Please try again.");
      setUploading(false);
      return;
    }
    if (
      !title ||
      !description ||
      !price ||
      !quantity ||
      !category ||
      !location ||
      images.length === 0
    ) {
      setUploading(false);
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    if (isNaN(parseFloat(price)) || isNaN(parseInt(quantity))) {
      setUploading(false);
      Alert.alert("Error", "Price and quantity must be valid numbers.");
      return;
    }

    console.log("user._id : ", user._id); // Debugging
    console.log("imagesPublicId : ", imagesPublicId); // Debugging
    console.log("images : ", images); // Debugging

    try {
      const response = await axios.post(
        "https://yourcustomsubdomain.loca.lt/api/products/addproduct",
        {
          title,
          description,
          price: parseFloat(price),
          quantity: parseInt(quantity),
          category,
          location,
          thumbnail: images[0], // Use the first image as the thumbnail
          images,
          imagesPublicId,
          postedBy: user._id, // Replace with the actual user ID
        }
      );

      if (response.status === 201) {
        // Alert.alert("Success", "Product added successfully!");

        // Reset the form
        setUploading(false);
        setTitle("");
        setDescription("");
        setPrice("");
        setQuantity("");
        setBrand("");
        setCategory("");
        setLocation("");
        setImages([]);
        setImagesPublicId([]);

        // Navigate to the home page
        router.replace("/(tabs)");
      } else {
        setUploading(false);
        Alert.alert("Error", "Failed to add product.");
      }
    } catch (error) {
      console.error(error);
      setUploading(false);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#18161b" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Uploading Modal */}
      <Modal visible={uploading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* <ActivityIndicator size="large" color="#004CFF" /> */}
            <LottieView
              source={require("../../assets/lottie/uploadingProduct.json")} // Path to your Lottie file
              autoPlay
              loop
              style={{ width: 150, height: 150 }} // Adjust size as needed
            />
            <Text style={styles.modalText}>Hang Tight... We are uploading</Text>
          </View>
        </View>
      </Modal>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Illustration and Explanation Section */}
          <View style={styles.illustrationContainer}>
            <LottieView
              source={require("../../assets/lottie/addProduct.json")} // Replace with your Lottie file
              autoPlay
              loop
              style={{ width: 80, height: 80 }} // Adjust size as needed
            />
            <Text style={styles.illustrationTitle}>How Selling Works</Text>
            <Text style={styles.illustrationText}>
              Your name and photo will show up on the product card — but don’t
              worry, your secrets (and DMs) stay safe unless you spill ‘em. Got
              stuff just collecting dust? Turn it into cash and maybe fund your
              next chai date or dopamine buy.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Sell Your Product</Text>

            {/* Image Upload */}
            <View style={styles.uploadBoxOutsideBorder}>
              <TouchableOpacity
                style={styles.uploadBox}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                {/* Image Preview */}
                <View style={styles.imagePreview}>
                  {localImages.map((uri, index) => (
                    <View key={index} style={styles.imageContainer}>
                      <Image source={{ uri }} style={styles.previewImage} />
                      {/* Remove Button */}
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveImage(index)}
                      >
                        <Image
                          source={require("../../assets/images/delete-icon.png")}
                          style={styles.removeButtonIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
                <Image
                  source={require("../../assets/images/upload-img.png")}
                  style={{ width: 30, height: 30 }}
                />
                <Text style={styles.uploadText}>
                  Tap to upload pics — make it look good!
                </Text>
              </TouchableOpacity>
            </View>

            {/* Input Fields */}
            <View style={styles.allInputGroup}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Product Title *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Whats it called?"
                  value={title}
                  onChangeText={setTitle}
                  placeholderTextColor="#cccccc" // Light gray placeholder text
                />
              </View>

              <Text style={styles.label}>Select a Category *</Text>
              <CategorySelector
                predefinedCategories={predefinedCategories}
                selectedCategory={category}
                onCategorySelect={(selectedCategory) =>
                  setCategory(selectedCategory)
                }
              />

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Add some details... whats it like?"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  placeholderTextColor="#cccccc" // Light gray placeholder text
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Price *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="How much?"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholderTextColor="#cccccc" // Light gray placeholder text
                  />
                </View>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Quantity *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="How many?"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    placeholderTextColor="#cccccc" // Light gray placeholder text
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location *</Text>
                {/* <TextInput
              style={styles.input}
              placeholder="Hostel, or anywhere around LPU"
              value={location}
              onChangeText={setLocation}
            /> */}
                <LocationSelector
                  selectedLocation={location}
                  onSelectLocation={setLocation}
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  uploading ? styles.disabledButton : styles.uploadButton,
                ]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Submit Product</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default addproduct;

// Styles
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#18161b", // Dark modal background
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#18161b", // Darker background for illustration
    paddingBottom: 30,
    padding: 15,
    borderRadius: 12,
  },
  illustrationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff", // White text
    textAlign: "center",
  },
  illustrationText: {
    fontSize: 12,
    color: "#cccccc", // Light gray text
    textAlign: "center",
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: "#18161b", // Dark background for the form
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -40,
    width: "100%",
    padding: 15,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff", // White text
    textAlign: "center",
  },
  allInputGroup: {
    marginBottom: 15,
    width: "100%",
    borderRadius: 12,
    // borderWidth: 1,
    padding: 12,
    marginTop: 15,
    borderColor: "#2a2b2f", // Darker border
    backgroundColor: "#18161b", // Dark input group background
  },
  uploadBoxOutsideBorder: {
    borderWidth: 2,
    borderColor: "#209440", // Green accent border
    borderRadius: 12,
    backgroundColor: "#209440", // Darker background
  },
  container: {
    flexGrow: 1,
    backgroundColor: "#18161b", // Dark background
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#ffffff", // White text
    marginBottom: 20,
    textAlign: "left",
  },
  uploadBox: {
    backgroundColor: "#202126", // Darker background
    borderWidth: 2,
    borderColor: "#209440", // Green accent border
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
    color: "#ffffff", // White text
    fontWeight: "bold",
  },
  imagePreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    justifyContent: "center",
  },
  imageContainer: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 75,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2b2f", // Darker border
  },
  removeButton: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#18161b", // Dark background for remove button
  },
  removeButtonIcon: {
    width: 18,
    height: 18,
    tintColor: "#ffffff", // White icon
  },
  inputGroup: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff", // White text
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#202126", // Darker input background
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "white", // White text
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  halfWidth: {
    width: "48%",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: "#209440", // Green accent
  },
  submitButton: {
    backgroundColor: "#209440", // Green accent
  },
  disabledButton: {
    backgroundColor: "#555555", // Gray for disabled button
  },
  buttonText: {
    color: "#ffffff", // White text
    fontSize: 18,
    fontWeight: "bold",
  },
});
