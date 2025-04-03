import { View, Text, Image } from "react-native";
import { Tabs } from "expo-router";

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name="index"
            options={{
                title: "Home",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <View>
                        <Text style={{ color: focused ? "#004CFF" : "#000000" }}>🏠</Text>
                    </View>
                ),
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                title: "Profile",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <View>
                        <Text style={{ color: focused ? "#004CFF" : "#000000" }}>👤</Text>
                    </View>
                ),
            }}
        />
        <Tabs.Screen
            name="addproduct"
            options={{
                title: "Products",
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <View>
                        <Text style={{ color: focused ? "#004CFF" : "#000000" }}>🛒</Text>
                    </View>
                ),
            }}
        />
    </Tabs>
  );
};

export default _layout;
