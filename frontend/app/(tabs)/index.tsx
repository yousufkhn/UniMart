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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSessionStore } from "@/utils/useSessionStore";
import AnnouncementCard from "../../components/AnnoucementCard";
import { useEffect, useState } from "react";
import axios from "axios";
import HomePageCategorySelector from "@/components/HomePageCategorySelector";
import ProductCard from "@/components/ProductCard";

// Images import
import allImage from "../../assets/images/categories/all.png";
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
import SortOptions from "@/components/SortOptions";
import { router } from "expo-router";

export default function Index() {
  const { user } = useSessionStore();

  const [location, setLocation] = useState("All");
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [selectedSort, setSelectedSort] = useState("Newer First");
  const [searchQuery, setSearchQuery] = useState(""); // For search input


  const locations = [
    "Lawgate",
    "Inside Campus",
    "Phagwara",
    "Deepnagar",
    "All",
  ];

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

  const handleSortSelect = (option: string) => {
    setSelectedSort(option);
  
    let sortedProducts = [...filteredProducts];
  
    switch (option) {
      case "Newer First":
        sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "Older First":
        sortedProducts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get<any[]>(
        "https://yourcustomsubdomain.loca.lt/api/products/getallproducts"
      );

      const sortedProducts = response.data.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    handleSearch("")
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredProducts(products); // Reset to all products if query is empty
    } else {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleCategorySelect = (selectedCategory: string) => {
    setCategory(selectedCategory);
  
    if (selectedCategory === "All") {
      setFilteredProducts(products); // Show all products if "All" is selected
    } else {
      const filtered = products.filter(
        (product) => product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  };


  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/product/index",
          params: { product: JSON.stringify(item) }, // Pass product data as params
        })
      }
    >
      <ProductCard product={item} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={"#18161b"} />
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => setDropdownVisible(true)}
        >
          <Icon
            name="location-sharp"
            size={20}
            color="#209440"
            style={styles.locationIcon}
          />
          <Text style={styles.locationText}>{location}</Text>
          <Icon
            name="chevron-down"
            size={20}
            color="white"
            style={styles.locationIcon}
          />
        </TouchableOpacity>

        <Modal
          transparent={true}
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
                  onPress={() => {
                    setLocation(loc);
                    setDropdownVisible(false);
                  }}
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
      <Icon name="close-circle" size={22} color="white" style={styles.clearIcon} />
    </TouchableOpacity>
  )}
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item._id}
        renderItem={renderProduct}
        refreshing={loading}
        onRefresh={fetchProducts}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            {/* <Text style={styles.categoriesTitle}>Categories</Text> */}
            <HomePageCategorySelector
              predefinedCategories={predefinedCategories}
              selectedCategory={category}
              onCategorySelect={(selectedCategory) =>
                handleCategorySelect(selectedCategory)
              }
            />
            <SortOptions
              options={sortOptions}
              selectedOption={selectedSort}
              onOptionSelect={handleSortSelect}
            />
          </View>
        }
        // ListFooterComponent={<AnnouncementCard />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 8,
    backgroundColor: "#18161b", // Dark background
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    backgroundColor: "#18161b", // Matches the container background
  },
  profileContainer: {
    width: 38,
    height: 38,
    borderRadius: 29,
    borderWidth: 1,
    borderColor: "#242328",
    backgroundColor: "#242328", // Darker shade for profile container
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
    color: "white", // White text for dark theme
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark overlay
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#202126", // Matches the search bar background
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
    color: "white", // White text for dropdown items
  },
  searchBar: {
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#202126", // Dark background for search bar
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
    color: "white", // White text for search input
    fontWeight: "500",
  },
  list: {
    padding: 10,
    backgroundColor: "#18161b", // Matches the container background
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  card: {
    backgroundColor: "#202126", // Dark card background
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#2a2b2f",
  },
  thumbnail: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardContent: {
    paddingHorizontal: 5,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white", // White text for product title
    flex: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#209440", // Green accent for price
  },
  description: {
    fontSize: 14,
    color: "#cccccc", // Light gray for description text
    marginBottom: 10,
  },
  uploadedByRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  uploadedByText: {
    fontSize: 14,
    color: "#cccccc", // Light gray for uploaded by text
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "white", // White text for categories title
    marginBottom: 15,
  },
  clearIcon: {
    marginLeft: 10, // Add spacing between the input and the icon
  }
});
