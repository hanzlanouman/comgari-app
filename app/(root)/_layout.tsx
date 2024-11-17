import { router, Stack } from "expo-router";
import "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";

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
      <Stack.Screen
        name="invoices"
        options={{
          headerShown: true,
          title: "Invoices",
          headerRight: () => (
            <LinearGradient
              colors={["#1B78B9", "#63348F"]}
              className="rounded-full w-8 h-8"
              start={[0, 0]}
              end={[1, 1]}
            >
              <TouchableOpacity
                onPress={() => router.push("/(root)/add-invoice")}
                className="w-full h-full rounded-full flex flex-row justify-center items-center"
              >
                <Plus size={18} className="text-white" />
              </TouchableOpacity>
            </LinearGradient>
          ),
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: "" }} />
    </Stack>
  );
};

export default Layout;
