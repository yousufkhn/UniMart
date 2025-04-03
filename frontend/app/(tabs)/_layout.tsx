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
                    <Image source={require("../../assets/images/home-icon.png")}
                    tintColor={focused ? "#004CFF" : "#000000"}
                     className="size-6" />
                ),
            }}
        />
        <Tabs.Screen
            name="profile"
            options={{
                title: "Profile",
                headerShown: false,
            }}
        />
    </Tabs>
  );
};

export default _layout;
