import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import "../globals.css";
import Icon from "react-native-vector-icons/Ionicons";
import { useSessionStore } from "@/utils/useSessionStore";
import AnnouncementCard from "../../components/AnnoucementCard";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Index() {
  const { user } = useSessionStore();

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get<any[]>("https://yourcustomsubdomain.loca.lt/api/products/getallproducts"); // Replace with your backend URL
      setProducts(response.data); // Set the fetched products to state
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching products:", error.message);
      } else {
        console.error("Error fetching products:", error);
      }
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when the component mounts
  }, []);


  // Render a single product card
  const renderProduct = ({ item }: { item: {_id:string, thumbnail: string; title: string; description: string; price: number } }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Top Row: Profile Picture, Title, and Settings Button */}
      <View style={styles.topBar}>
        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <Image source={{ uri: user?.studentPicture }} style={styles.image} resizeMode="cover" />
        </View>

        {/* Title */}
        <Text style={styles.title}>UniMart</Text>

        {/* Settings Button */}
        <TouchableOpacity style={styles.button}>
          <Icon name="settings-outline" size={24} color="#004CFF" />
        </TouchableOpacity>
      </View>

      {/* Greeting Message */}
      <Text style={styles.greeting}>Hello, {user?.studentName?.split(" ")[0]}!</Text>
      

      {/* More content will be added here later */}
      <FlatList
      data={products}
      keyExtractor={(item) => item._id}
      renderItem={renderProduct}
      contentContainerStyle={styles.list}
    />
      <AnnouncementCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 3,
    borderColor: "#e5ebfc",
    backgroundColor: "#e5ebfc",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 29,
    backgroundColor: "#e5ebfc",
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "black",
    marginTop: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  thumbnail: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
});
