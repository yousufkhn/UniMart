import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import Carousel from "react-native-reanimated-carousel";
import axios from "axios";

const { width } = Dimensions.get("window"); // Get screen width for full-width images

const ProductPage = () => {
  const {productId} = useLocalSearchParams(); // Retrieve product ID from params
  // console.log("Product ID received:", productId); // Debugging
  const [productData, setProductData] = useState<any>(null); // State to hold product data
  const [userDetails, setUserDetails] = useState<any>(null); // State to hold user details
  const [userLoading, setUserLoading] = useState(true); // Loading state for user
  const [loading, setLoading] = useState(true); // Loading state

  //for old login when passing product details itself
  // const { product } = useLocalSearchParams(); // Retrieve product details passed as params
  // const productData = JSON.parse(product as string); // Parse the product data
  const [selectedIndex, setSelectedIndex] = useState(0); // Track the currently selected image
  const carouselRef = useRef(null); // Reference to the carousel with proper typing

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false); // Toggle description state

  // console.log("Product thumbnail:", productData.thumbnail); // Debugging
  // console.log("Product data:", productData); // Debugging

  // Fetch product details from the database
  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `https://yourcustomsubdomain.loca.lt/api/products/getproduct/${productId}`
      );
      setProductData(response.data);
      // console.log("Product details:", response.data); // Debugging

      // Fetch user details after product data is fetched
      const product = response.data as { postedBy?: string }; // Explicitly type response.data
      if (product.postedBy) {
        fetchUserDetails(product.postedBy);
      } else {
        setUserLoading(false); // No user to fetch
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      console.log("Fetching user details for ID:", userId); // Debugging
      const response = await axios.get(
        `https://yourcustomsubdomain.loca.lt/api/users/getuser/${userId}`
      );
      setUserDetails(response.data);
      console.log("User details fetched:", response.data); // Debugging
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setUserLoading(false); // Ensure user loading state is updated
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    } else {
      console.error("Product ID is undefined");
      setLoading(false); // Stop loading if productId is missing
    }
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#209440" />
      </View>
    );
  }

  if (!productData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
      </View>
    );
  }

  const handleImagePress = (index: number) => {
    setSelectedIndex(index); // Update the selected index
    carouselRef.current?.scrollTo({ index, animated: true }); // Scroll to the selected image
  };

  const handleToggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded); // Toggle the description state
  };

  const handleContactNow = () => {
    console.log("Contact Now button pressed!");
    // Add your contact logic here
  };

  const handleWishlist = () => {
    console.log("Wishlist button pressed!");
    // Add your wishlist logic here
  };

  const handleShare = async () => {
    try {
      const shareMessage = `Check out this product on UniMart:
      
  ${productData.title}
  
  ${productData.description.substring(
    0,
    100
  )}...
  
  Price: ₹${productData.price}
  
  Link: https://unimart.com/product/${productData.id}`;

      await Share.share({
        message: shareMessage,
        title: productData.title,
        url: productData.thumbnail, // Optional: Add the thumbnail URL if supported by the platform
      });
    } catch (error) {
      console.error("Error sharing product:", error);
    }
  };

  const calculateDaysAgo = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - createdDate.getTime();
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays === 0 ? "Today" : `${differenceInDays} days ago`;
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Product Images Carousel */}
        <View style={styles.imageContainer}>
          <Carousel
            ref={carouselRef} // Reference to the carousel
            width={width} // Full width of the screen
            height={250} // Height of the carousel
            data={productData.images} // Array of images
            renderItem={({ item }) => (
              <Image
                source={{ uri: item as string }}
                style={styles.carouselImage}
                resizeMode="contain"
              />
            )}
            loop={true} // Enable infinite loop
            autoPlay={false} // Enable autoplay
            scrollAnimationDuration={100} // Smooth scrolling animation
            onSnapToItem={(index) => setSelectedIndex(index)} // Set autoplay interval to 3 seconds
          />
        </View>

        {/* Image Previews */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.previewContainer}
        >
          {productData.images.map((image: string, index: number) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(index)} // Navigate to the selected image
              style={[
                styles.previewImageContainer,
                selectedIndex === index && styles.selectedPreview, // Highlight the selected image
              ]}
            >
              <Image source={{ uri: image }} style={styles.previewImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{productData.price}</Text>
            <Text style={styles.daysAgo}>
              Posted : {calculateDaysAgo(productData.createdAt)}
            </Text>
          </View>
          <Text style={styles.title}>{productData.title}</Text>
          <Text style={styles.quantity}>Quantity: {productData.quantity}</Text>
          {/* Collapsible Description */}
          <Text
            style={styles.description}
            numberOfLines={isDescriptionExpanded ? undefined : 2} // Show only 2 lines if not expanded
          >
            {productData.description}
          </Text>
          <TouchableOpacity onPress={handleToggleDescription}>
            <Text style={styles.toggleDescription}>
              {isDescriptionExpanded ? "Show Less ▲" : "Show More ▼"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category and Location Card */}
        <View style={styles.cardContainer}>
          {/* Category Section */}
          <View style={styles.cardSection}>
            <Icon
              name="pricetag-outline"
              size={20}
              color="#209440"
              style={styles.cardIcon}
            />
            <View>
              <Text style={styles.cardLabel}>Category</Text>
              <Text style={styles.cardValue}>{productData.category}</Text>
            </View>
          </View>

          {/* Vertical Divider */}
          <View style={styles.verticalDivider} />

          {/* Location Section */}
          <View style={styles.cardSection}>
            <Icon
              name="location-outline"
              size={20}
              color="#209440"
              style={styles.cardIcon}
            />
            <View>
              <Text style={styles.cardLabel}>Location</Text>
              <Text style={styles.cardValue}>{productData.location}</Text>
            </View>
          </View>
        </View>

        {/* Posted By Card */}
        <View style={styles.postedByCard}>
          {userLoading ? (
            <ActivityIndicator size="small" color="#209440" />
          ) : userDetails ? (
            <>
              <Image
                source={{ uri: userDetails.studentPicture }}
                style={styles.postedByImageBlurred}
                blurRadius={10} // Apply blur effect to the image
              />
              <View style={styles.postedByContent}>
                <Text style={styles.postedByLabel}>Posted By</Text>
                <Text style={styles.postedByName}>
                  {userDetails.studentName.split(" ")[0]}...
                </Text>
              </View>
            </>
          ) : (
            <Text style={styles.errorText}>User details not available</Text>
          )}
        </View>

        {/* Footer Text */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with love ❤️</Text>
        </View>
      </ScrollView>
      {/* Sticky Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactNow}
        >
          <Text style={styles.contactButtonText}>Contact Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleWishlist}
        >
          <Icon name="heart-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Icon name="share-social-outline" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#18161b", padding: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#ffffff", fontSize: 16 },
  imageContainer: { alignItems: "center", marginBottom: 20 },
  productImage: { width: "100%", height: 250, borderRadius: 10 },
  detailsContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#202126",
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 10,
  },
  quantity: {
    fontSize: 14,
    fontWeight: "400",
    color: "#cccccc",
    marginBottom: 10,
  },
  carouselImage: {
    width: width,
    height: 250,
    borderRadius: 10,
  },
  previewContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  previewImageContainer: {
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent", // Default border color
  },
  selectedPreview: {
    borderColor: "#209440", // Highlighted border color for selected image
  },
  previewImage: {
    width: 60,
    height: 50,
    borderRadius: 10,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  daysAgo: {
    fontSize: 14,
    fontWeight: "400",
    color: "#cccccc",
  },
  description: { fontSize: 16, color: "#cccccc", marginBottom: 5 },
  toggleDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: "#209440",
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#202126",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardIcon: {
    marginRight: 10,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#cccccc",
  },
  cardValue: {
    fontSize: 16,
    color: "#ffffff",
  },
  verticalDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#ffffff",
    marginHorizontal: 15,
    opacity: 0.2, // Slightly transparent for a subtle effect
  },
  postedByCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#202126",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    overflow: "hidden", // Ensure the content stays within the card
  },
  postedByImageBlurred: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  postedByContent: {
    flex: 1,
  },
  postedByLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#cccccc",
    marginBottom: 5,
  },
  postedByName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#202126",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#333",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  contactButton: {
    backgroundColor: "#209440",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 5,
    flex: 1,
  },
  contactButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  wishlistButton: {
    // backgroundColor: "#333",
    padding: 10,
    borderRadius: 5,
  },
  shareButton: {
    padding: 10,
    borderRadius: 5,
  },
  footer: {
    alignItems: "center",
    marginBottom: 80, // Add some spacing above the bottom navigation
  },
  footerText: {
    fontSize: 14,
    color: "#cccccc",
  },
});
