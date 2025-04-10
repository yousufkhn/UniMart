import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

const ProductPage = () => {
  const router = useRouter();
  const { product } = useLocalSearchParams(); // Retrieve product details passed as params

  const productData = JSON.parse(product as string); // Parse the product data

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: productData.thumbnail }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{productData.title}</Text>
        <Text style={styles.price}>₹{productData.price}</Text>
        <Text style={styles.description}>{productData.description}</Text>
      </View>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProductPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#18161b", padding: 10 },
  imageContainer: { alignItems: "center", marginBottom: 20 },
  productImage: { width: "100%", height: 250, borderRadius: 10 },
  detailsContainer: { marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#209440",
    marginBottom: 10,
  },
  description: { fontSize: 16, color: "#cccccc" },
  backButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#209440",
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: { fontSize: 16, color: "#ffffff", fontWeight: "bold" },
});
