/* eslint-disable prettier/prettier */
import { TouchableOpacity, Text } from "react-native";
import { Href, Redirect, router, Stack } from "expo-router";
import "react-native-reanimated";
import { useAppSelector } from "@/hooks/redux";
import { route } from "@/common";
import { useEffect } from "react";

const Layout = () => {
  const { isAuthenticated, isSubscribed } = useAppSelector((state) => state.auth);
  console.log("isAuthenticated", isAuthenticated)
  console.log("isSubscribed", isSubscribed)
  
  useEffect(() => {
    if (isAuthenticated && !isSubscribed) {
      router.push("/(auth)/go-pro");
    }
  }, [isAuthenticated, isSubscribed]);

  if (isAuthenticated && isSubscribed) {
    return <Redirect href={route.root.home as unknown as Href} />;
  }

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
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen
        name="forgot-password"
        options={{ headerShown: true, title: "Forgot Your Password?", headerBackTitle: "Sign In" }}
      />
      <Stack.Screen name="otp" options={{ headerShown: true, title: "Enter OTP Code!" }} />
      <Stack.Screen
        name="reset-password"
        options={{ headerShown: true, title: "Reset Your Password" }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: true,
          title: "Sign Up to Comgari",
          headerBackTitle: "Welcome",
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
              <Text className="text-sm sm:text-base font-ManropeSemibold text-blue">
                Sign In
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="go-pro" options={{ headerShown: true, title: "Upgrade to Pro!" }} />

      <Stack.Screen
        name="payment-method"
        options={{ headerShown: true, title: "Choose a Payment Option" }}
      />
      <Stack.Screen
        name="add-card"
        options={{ headerShown: true, title: "Link Your Card" }}
      />
    </Stack>
  );
};

export default Layout;