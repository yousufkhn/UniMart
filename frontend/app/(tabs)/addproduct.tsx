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
];

const addproduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
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
      setImages([...images, ...result.assets.map((asset) => asset.uri)]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleUpload = async () => {
    setUploading(true);

    // Simulate image upload (replace with your actual upload logic)
    const uploadedImages = [];
    for (const image of images) {
      const uploadedImage = await uploadImageToCloudinary(image); // Replace with your upload function
      if (uploadedImage) {
        uploadedImages.push({
          url: uploadedImage.url,
          public_id: uploadedImage.public_id,
        });
      } else {
        Alert.alert("Error", "One of the images failed to upload.");
        setUploading(false);
        return;
      }
    }

    setImages(uploadedImages.map((img) => img.url));
    setImagesPublicId(uploadedImages.map((img) => img.public_id));
    // Alert.alert("Success", "Images uploaded successfully!");
  };

  const { user } = useSessionStore(); // Assuming you have a user object in your Zustand store

  const handleSubmit = async () => {
    await handleUpload();
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
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Uploading Modal */}
    <Modal
      visible={uploading}
      transparent
      animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* <ActivityIndicator size="large" color="#004CFF" /> */}
          <LottieView
        source={require("../../assets/lottie/uploadingProduct.json")} // Path to your Lottie file
        autoPlay
        loop
        style={{ width: 150, height: 150 }} // Adjust size as needed
      />
          <Text style={styles.modalText}>Uploading your product...</Text>
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
          <Text style={styles.illustrationText}>Your name and photo will show up on the product card — but don’t worry, your secrets (and DMs) stay safe unless you spill ‘em.
          Got stuff just collecting dust? Turn it into cash and maybe fund your next chai date or dopamine buy.
          </Text>
        </View>

        <View style={styles.formContainer}>

          <Text style={styles.title}>Sell Your Product</Text>

          {/* Image Upload */}
          <View style={styles.uploadBoxOutsideBorder}>
          <TouchableOpacity 
          style={styles.uploadBox} 
          onPress={pickImage}
          activeOpacity={0.8}>
            {/* Image Preview */}
            <View style={styles.imagePreview}>
              {images.map((uri, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  {/* Remove Button */}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Image source={require("../../assets/images/delete-icon.png")} style={styles.removeButtonIcon}/>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <Image
              source={require("../../assets/images/upload-img.png")}
              style={{ width: 30, height: 30 }}
            />
            <Text style={styles.uploadText}>Tap to upload pics — make it look good!</Text>
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
            />
          </View>

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
            onSelectLocation={setLocation} />

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
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
  illustrationContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#d4d2f9", // Light background for the illustration section
    paddingVertical: 20,
    paddingBottom: 30,
    padding:15
  },
  illustrationTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  illustrationText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  formContainer: {
    backgroundColor: "white", // Different background color for the form
    borderTopLeftRadius: 20, // Rounded corners at the top
    borderTopRightRadius: 20,
    marginTop: -40,
    width: "100%",
    padding:15
  },
  loadingSpinner: {
    width: 50,
    height: 50,
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  allInputGroup: {
    marginBottom: 15,
    width: "100%",
    borderRadius: 12,
    borderWidth:1,
    padding: 12,
    marginTop: 15,
    borderColor: "#e9ebec",
    backgroundColor: "white",
  },
  uploadBoxOutsideBorder: {
    borderWidth: 4, // Outer border width
    borderColor: "#d4d2f9",
    borderRadius: 12, // Outer border radius
    backgroundColor:"#d4d2f9"
  },
  container: {
    // paddingTop: 20,
    flexGrow: 1,
    backgroundColor: "#f9fbfc",
    // padding: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    textAlign: "left",
  },
  uploadBox: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#007bff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "100%",
    // height: "15%",
    justifyContent: "center",
  },
  uploadText: {
    marginTop: 10,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  imagePreview: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    justifyContent: "center",
  },
  imageContainer: {
    position: "relative", // To position the remove button over the image
    marginRight: 10,
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 75,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f9fbfc",
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
  },
  removeButtonIcon: {
    width:18,
    height:18,
  },
  inputGroup: {
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f1f4fe",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#333",
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
    backgroundColor: "#007bff",
  },
  submitButton: {
    backgroundColor: "#007bff",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
