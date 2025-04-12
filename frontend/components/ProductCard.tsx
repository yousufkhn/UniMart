import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

interface ProductCardProps {
  product: {
    _id: string;
    thumbnail: string;
    title: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    location: string;
    date: string;
    postedBy: { studentPicture: string; studentName: string };
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Calculate "X days ago"
  const getDaysAgo = (date: string) => {
    const postedDate = new Date(date);
    const today = new Date();
    const differenceInTime = today.getTime() - postedDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays === 0 ? "Today" : `${differenceInDays} days ago`;
  };

  // console.log("main page product thumbnail ",product.thumbnail); // Debugging

  return (
    <View style={styles.card}>
      {/* Thumbnail with Wishlist and Days Ago */}
      <View style={styles.thumbnailContainer}>
        <Image source={{ uri: product.thumbnail }} style={styles.thumbnail} />
        {/* Wishlist Heart */}
        <TouchableOpacity style={styles.wishlistIcon}>
          <Icon name="heart-outline" size={24} color="white" />
        </TouchableOpacity>
        {/* Days Ago */}
        <View style={styles.daysAgoContainer}>
          <Text style={styles.daysAgoText}>{getDaysAgo(product.date)}</Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Title and Price */}
        <View style={styles.titleRow}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <Text style={styles.price}>₹{product.price}</Text>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>
      </View>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#202126", // Dark card background
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#2a2b2f",
  },
  thumbnailContainer: {
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  wishlistIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Translucent background
    borderRadius: 20,
    padding: 5,
  },
  daysAgoContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Translucent background
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  daysAgoText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500",
  },
  cardContent: {
    padding: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: "600", // Medium weight for the title
    color: "white",
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#209440", // Green accent for price
  },
  description: {
    fontSize: 14,
    color: "#cccccc", // Light gray for description text
    marginBottom: 10,
  },
});