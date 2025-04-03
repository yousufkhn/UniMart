import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput, Alert, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {uploadImageToCloudinary} from '../../utils/cloudinaryUpload'; // Adjust the import path as necessary
import { useSessionStore } from '@/utils/useSessionStore';
import axios from 'axios';

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
      allowsEditing:true,
      quality: 0.5,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map(asset => asset.uri)]);
    }
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
    setUploading(false);
    // Alert.alert("Success", "Images uploaded successfully!");
  };

  const {user } = useSessionStore(); // Assuming you have a user object in your Zustand store

  const handleSubmit = async () => {
    await handleUpload();
    if (!title || !description || !price || !quantity || !category || !location || images.length === 0) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    if (isNaN(parseFloat(price)) || isNaN(parseInt(quantity))) {
        Alert.alert("Error", "Price and quantity must be valid numbers.");
        return;
      }

    try {
      const response = await axios.post("https://yourcustomsubdomain.loca.lt/api/products/addproduct", {
        title,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        brand,
        category,
        location,
        thumbnail: images[0], // Use the first image as the thumbnail
        images,
        imagesPublicId,
        postedBy:user?.reg_no , // Replace with the actual user ID
      });

      if (response.status === 201) {
        Alert.alert("Success", "Product added successfully!");
      } else {
        Alert.alert("Error", "Failed to add product.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Add New Product</Text>

          {/* Image Upload */}
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            <Text style={styles.uploadText}>Tap to upload images</Text>
          </TouchableOpacity>

          {/* Image Preview */}
          <View style={styles.imagePreview}>
            {images.map((uri, index) => (
              <Image key={index} source={{ uri }} style={styles.previewImage} />
            ))}
          </View>

          {/* Input Fields */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Title *</Text>
            <TextInput style={styles.input} placeholder="Enter product title" value={title} onChangeText={setTitle} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter product description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Price *</Text>
              <TextInput style={styles.input} placeholder="Enter price" value={price} onChangeText={setPrice} keyboardType="numeric" />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Quantity *</Text>
              <TextInput style={styles.input} placeholder="Enter quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category *</Text>
            <TextInput style={styles.input} placeholder="Enter category" value={category} onChangeText={setCategory} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Location *</Text>
            <TextInput style={styles.input} placeholder="Enter location" value={location} onChangeText={setLocation} />
          </View>

          {/* Buttons */}
          {/* <TouchableOpacity
            style={[styles.button, uploading ? styles.disabledButton : styles.uploadButton]}
            onPress={handleUpload}
            disabled={uploading}
          >
            <Text style={styles.buttonText}>{uploading ? "Uploading..." : "Upload Images"}</Text>
          </TouchableOpacity> */}

          <TouchableOpacity style={[styles.button, uploading ? styles.disabledButton : styles.uploadButton]}
          onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit Product</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default addproduct;

// Styles
const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: "#f9f9f9",
      padding: 20,
      alignItems: "center",
    },
    title: {
      fontSize: 26,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 20,
      textAlign: "center",
    },
    uploadBox: {
      backgroundColor: "#e3f2fd",
      borderWidth: 1,
      borderColor: "#007bff",
      borderRadius: 12,
      padding: 15,
      alignItems: "center",
      width: "100%",
      marginBottom: 20,
    },
    uploadText: {
      fontSize: 16,
      color: "#007bff",
      fontWeight: "bold",
    },
    imagePreview: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 20,
      justifyContent: "center",
    },
    previewImage: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginRight: 10,
      marginBottom: 10,
    },
    inputGroup: {
      marginBottom: 15,
      width: "100%",
    },
    label: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#555",
      marginBottom: 5,
    },
    input: {
      backgroundColor: "#fff",
      borderWidth: 1,
      borderColor: "#ddd",
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
      backgroundColor: "#28a745",
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