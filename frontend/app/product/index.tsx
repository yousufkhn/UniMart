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
  Linking,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import Carousel from "react-native-reanimated-carousel";
import axios from "axios";

// Images import
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

const { width } = Dimensions.get("window"); // Get screen width for full-width images

const ProductPage = () => {
  const { productId } = useLocalSearchParams(); // Retrieve product ID from params
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

  const categoriesIcons = [
    { name: "Electronics", image: electronicsImage },
    { name: "Fashion", image: fashionImage },
    { name: "Appliances", image: homeAppliancesImage },
    { name: "Books", image: booksImage },
    { name: "Toys", image: toysImage },
    { name: "Sports", image: sportsImage },
    { name: "Groceries", image: groceriesImage },
    { name: "Health", image: healthBeautyImage },
    { name: "Automotive", image: automotiveImage },
    { name: "Furniture", image: furnitureImage },
  ];

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
  
  ${productData.description.substring(0, 100)}...
  
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
          {/* Title and Price */}
          <View style={styles.titlePriceRow}>
            <Text style={styles.title}>{productData.title}</Text>
            <Text style={styles.price}>₹{productData.price}</Text>
          </View>

          {/* Thin Line */}
          <View style={styles.divider} />

          {/* Description */}
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
            <Image
              source={
                categoriesIcons.find(
                  (category) => category.name === productData.category
                )?.image || require("../../assets/images/categories/all.png") // Fallback to a default icon
              }
              style={styles.categoryIcon}
            />
            <View>
              <Text style={styles.cardLabel}>Category</Text>
              <Text style={styles.cardValue}>{productData.category}</Text>
            </View>
          </View>

          {/* Vertical Divider */}
          <View style={styles.verticalDivider} />

          {/* Location Section */}
          <TouchableOpacity style={styles.cardSection}
          // onPress={() => Linking.openURL(productData.locationLink)} // Open Google Maps link
          onPress={() => Linking.openURL("https://maps.app.goo.gl/998vq68rmUhCoCCb6")}
          >
            <Image
              source={require("../../assets/images/map.png")}
              style={styles.categoryIcon}
            />
            <View>
              <Text style={styles.cardLabel}>Location</Text>
              <Text style={styles.cardValue}>{productData.location}</Text>
              
            </View>
          </TouchableOpacity>
        </View>

        {/* Posted By Section */}
        <View style={styles.postedByCard}>
          {userLoading ? (
            <ActivityIndicator size="small" color="#209440" />
          ) : userDetails ? (
            <>
              {/* Blurred Image */}
              <Image
                source={{ uri: userDetails.studentPicture }}
                style={styles.postedByImageBlurred}
                blurRadius={10} // Apply blur effect to the image
              />
              <View style={styles.postedByContent}>
                {/* First Word of the Name */}
                <Text style={styles.postedByName}>
                  {userDetails.studentName.split(" ")[0] + "..."}{" "}
                  {/* Extract only the first word */}
                </Text>
                <Text style={styles.postedByDaysAgo}>
                  {calculateDaysAgo(productData.createdAt)}
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
    borderRadius: 10,
    backgroundColor: "#202126",
  },
  titlePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff",
    flex: 1, // Allow the title to take up available space
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
    fontSize: 18,
    fontWeight: "600",
    color: "white",
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
  categoryIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: "contain", // Ensure the icon fits within the bounds
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
  },
  postedByImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 15,
  },
  postedByContent: {
    flex: 1,
  },
  postedByName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
  },
  postedByDaysAgo: {
    fontSize: 12,
    color: "#cccccc",
  },
  postedByImageBlurred: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 15,
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
  divider: {
    height: 1,
    backgroundColor: "#333", // Subtle gray color for the line
    marginVertical: 5, // Add spacing above and below the line
    opacity: 0.5, // Slight transparency for a subtle effect
  },
locationIcon: {
  marginLeft: 10, // Add spacing between the icon and the text
},
});
