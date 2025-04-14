import { View, Image, StyleSheet } from "react-native";
import { Tabs } from "expo-router";

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: "#209440",
        tabBarInactiveTintColor: "#cccccc",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={require("../../assets/images/home-white.png")} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={require("../../assets/images/user-inactive.png")} />
          ),
        }}
      />
      <Tabs.Screen
        name="addproduct"
        options={{
          title: "Add Product",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={require("../../assets/images/add-inactive.png")} />
          ),
        }}
      />
    </Tabs>
  );
};

const TabIcon = ({ focused, icon }: { focused: boolean; icon: any }) => (
  <View style={styles.iconWrapper}>
    {focused && <View style={styles.activeBorder} />}
    <Image source={icon} style={styles.icon} />
  </View>
);

export default _layout;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#18161b",
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  activeBorder: {
    position: "absolute",
    top: -12, // lift it above the tab bar
    width: 80,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#209440",
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
