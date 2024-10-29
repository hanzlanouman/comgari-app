import { Stack } from "expo-router";
import "react-native-reanimated";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerTintColor: "#1C1C1C",
        headerTitleStyle: {
          fontFamily: "Manrope-SemiBold",
        },
        headerStyle: {
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="go-pro" options={{ headerShown: true, title: "" }} />
      <Stack.Screen
        name="payment-method"
        options={{ headerShown: true, title: "Payment Method" }}
      />
      <Stack.Screen
        name="add-card"
        options={{ headerShown: true, title: "Add Card" }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "" }} />
    </Stack>
  );
};

export default Layout;
