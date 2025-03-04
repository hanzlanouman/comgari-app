import { Stack } from "expo-router";


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
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Profile",
        }}
      />
      <Stack.Screen
        name="plans"
        options={{ headerShown: true, title: "Plans" }}
      />
      <Stack.Screen
        name="plan-details"
        options={{ headerShown: true, title: "Current Plan" }}
      />
      <Stack.Screen
        name="payment-method"
        options={{ headerShown: true, title: "Select Payment Method" }}
      />
    </Stack>
  );
};

export default Layout;
