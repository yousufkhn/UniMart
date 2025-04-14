import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Pressable,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import { useSessionStore } from "@/utils/useSessionStore";
import axios from "axios";
import { router } from "expo-router";

// Components
import HomePageCategorySelector from "@/components/HomePageCategorySelector";
import ProductCard from "@/components/ProductCard";
import SortOptions from "@/components/SortOptions";

// Images
import allImage from "@/assets/images/categories/all.png";
import electronicsImage from "@/assets/images/categories/electronics.png";
import fashionImage from "@/assets/images/categories/fashion.png";
import homeAppliancesImage from "@/assets/images/categories/home_appliances.png";
import booksImage from "@/assets/images/categories/books.png";
import toysImage from "@/assets/images/categories/toys.png";
import sportsImage from "@/assets/images/categories/sports.png";
import groceriesImage from "@/assets/images/categories/groceries.png";
import healthBeautyImage from "@/assets/images/categories/health_beauty.png";
import automotiveImage from "@/assets/images/categories/automotive.png";
import furnitureImage from "@/assets/images/categories/furniture.png";

export default function Index() {
  const { user } = useSessionStore();

  // State Variables
  const [location, setLocation] = useState("All");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Newer First");
  const [searchQuery, setSearchQuery] = useState("");

  // Predefined Data
  const locations = ["Law Gate", "LPU Campus", "Phagwara", "DeepNagar", "All"];
  const predefinedCategories = [
    { name: "All", image: allImage },
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
  const sortOptions = [
    "Newer First",
    "Price Low to High",
    "Price High to Low",
    "Older First",
  ];

  // Fetch Products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<any[]>(
        "https://yourcustomsubdomain.loca.lt/api/products/getallproducts"
      );

      const sortedProducts = response.data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProducts(sortedProducts);
      applyFilters(sortedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply Filters
  const applyFilters = (productsToFilter: any[] = products) => {
    const filtered = productsToFilter.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        category === "All" ||
        product.category.toLowerCase() === category.toLowerCase();
      const matchesLocation =
        location === "All" ||
        product.location?.toLowerCase() === location.toLowerCase();

      return matchesSearch && matchesCategory && matchesLocation;
    });

    setFilteredProducts(filtered);
    handleSortSelect(selectedSort, filtered);
  };

  // Handle Sorting
  const handleSortSelect = (option: string, productsToSort: any[] = filteredProducts) => {
    setSelectedSort(option);

    let sortedProducts = [...productsToSort];

    switch (option) {
      case "Newer First":
        sortedProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "Older First":
        sortedProducts.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "Price Low to High":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "Price High to Low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredProducts(sortedProducts);
  };

  // Handle Search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters();
  };

  // Handle Category Selection
  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
    applyFilters();
  };

  // Handle Location Selection
  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
  
    // Apply filters immediately after updating the location
    const filtered = products.filter((product) => {
      const matchesLocation =
        selectedLocation === "All" ||
        product.location?.toLowerCase() === selectedLocation.toLowerCase();
      const matchesCategory =
        category === "All" ||
        product.category.toLowerCase() === category.toLowerCase();
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
  
      return matchesLocation && matchesCategory && matchesSearch;
    });
  
    setFilteredProducts(filtered);
    handleSortSelect(selectedSort, filtered); // Reapply sorting
    setDropdownVisible(false); // Close the dropdown after filtering
  };  

  // Render Product
  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/product",
          params: { productId: item._id },
        })
      }
    >
      <ProductCard product={item} />
    </TouchableOpacity>
  );

  // Render Empty List
  const renderEmptyList = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#209440" />
          <Text style={styles.emptyText}>Loading products...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <LottieView
          source={require("../../assets/lottie/empty.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={styles.emptyText}>No products available</Text>
      </View>
    );
  };

  // Fetch products on initial load
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#18161b"} />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => setDropdownVisible(true)}
        >
          <Icon name="location-sharp" size={20} color="#209440" style={styles.locationIcon} />
          <Text style={styles.locationText}>{location}</Text>
          <Icon name="chevron-down" size={20} color="white" style={styles.locationIcon} />
        </TouchableOpacity>

        <Modal
          transparent
          visible={isDropdownVisible}
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.dropdown}>
              {locations.map((loc) => (
                <TouchableOpacity
                  key={loc}
                  style={styles.dropdownItem}
                  onPress={() => handleLocationSelect(loc)}
                >
                  <Text style={styles.dropdownText}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>

        <TouchableOpacity style={styles.button}>
          <Icon name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileContainer}>
          <Image
            source={{ uri: user?.studentPicture }}
            style={styles.image}
            resizeMode="cover"
          />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Icon name="search" size={22} color="white" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products"
          placeholderTextColor="white"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.trim() !== "" && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Icon name="close-circle" size={22} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        refreshing={loading}
        onRefresh={fetchProducts}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <HomePageCategorySelector
              predefinedCategories={predefinedCategories}
              selectedCategory={category}
              onCategorySelect={handleCategorySelect}
            />
            <SortOptions
              options={sortOptions}
              selectedOption={selectedSort}
              onOptionSelect={handleSortSelect}
            />
          </View>
        }
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 8,
    backgroundColor: "#18161b",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: "#18161b",
  },
  profileContainer: {
    width: 38,
    height: 38,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: "#242328",
    backgroundColor: "#242328",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 35,
    height: 35,
    borderRadius: 27,
  },
  button: {
    width: 37,
    height: 37,
    borderRadius: 29,
    borderColor: "#242328",
    backgroundColor: "transparent",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  locationIcon: {
    marginRight: 5,
  },
  locationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#202126",
    borderRadius: 10,
    padding: 10,
    width: "80%",
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2b2f",
  },
  dropdownText: {
    fontSize: 16,
    color: "white",
  },
  searchBar: {
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#202126",
    borderRadius: 12,
    borderColor: "#2a2b2f",
    borderWidth: 1,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  list: {
    padding: 10,
    backgroundColor: "#18161b",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  lottie: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#cccccc",
    textAlign: "center",
    fontWeight: "500",
  },
});