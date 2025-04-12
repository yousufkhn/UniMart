import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";

const ProductPage = () => {
  const { product } = useLocalSearchParams(); // Retrieve product details passed as params

  const productData = JSON.parse(product as string); // Parse the product data

  console.log("Product thumbnail:", productData.thumbnail); // Debugging
  console.log("Product data:", productData); // Debugging

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: productData.thumbnail }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>

      {/* Product Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{productData.title}</Text>
        <Text style={styles.price}>₹{productData.price}</Text>
        <Text style={styles.description}>{productData.description}</Text>
      </View>

      {/* Additional Details */}
      <View style={styles.additionalDetails}>
        <View style={styles.detailRow}>
          <Icon name="pricetag-outline" size={20} color="#209440" style={styles.icon} />
          <Text style={styles.detailLabel}>Category:</Text>
          <Text style={styles.detailValue}>{productData.category}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="location-outline" size={20} color="#209440" style={styles.icon} />
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{productData.location}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="cube-outline" size={20} color="#209440" style={styles.icon} />
          <Text style={styles.detailLabel}>Quantity:</Text>
          <Text style={styles.detailValue}>{productData.quantity}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="person-outline" size={20} color="#209440" style={styles.icon} />
          <Text style={styles.detailLabel}>Posted By:</Text>
          <View style={styles.postedByContainer}>
            <Image
              source={{ uri: productData.postedBy.studentPicture }}
              style={styles.postedByImage}
            />
            <Text style={styles.postedByName}>
              {productData.postedBy.studentName}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Icon name="calendar-outline" size={20} color="#209440" style={styles.icon} />
          <Text style={styles.detailLabel}>Posted On:</Text>
          <Text style={styles.detailValue}>
            {new Date(productData.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
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
  description: { fontSize: 16, color: "#cccccc", marginBottom: 20 },
  additionalDetails: {
    backgroundColor: "#202126",
    padding: 15,
    borderRadius: 10,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#cccccc",
    marginRight: 5,
  },
  detailValue: {
    fontSize: 16,
    color: "#ffffff",
    flex: 1,
  },
  postedByContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 5,
  },
  postedByImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  postedByName: {
    fontSize: 16,
    color: "#ffffff",
  },
});