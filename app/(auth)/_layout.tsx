/* eslint-disable prettier/prettier */
import { TouchableOpacity, Text } from "react-native";
import { Href, router, Stack } from "expo-router";
import { useAppSelector } from "@/hooks/redux";
import { route } from "@/common";
import { useEffect } from "react";
import { IS_IOS } from "@/utils";

const Layout = () => {
  const { isAuthenticated = false, isSubscribed = false } = useAppSelector(
    (state) => state.auth ?? {}
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/welcome");
      return;
    }

    // Handle iOS specific logic for unsubscribed users
    if (isAuthenticated && !isSubscribed && IS_IOS) {
      router.replace("/(auth)/go-pro");
      return;
    }

    // Normal flow for Android or subscribed iOS users
    if (isAuthenticated && !isSubscribed) {
      router.replace("/(auth)/go-pro");
      return;
    }

    if (isAuthenticated && isSubscribed) {
      router.replace(route.root.home as unknown as Href);
    }
  }, [isAuthenticated, isSubscribed]);

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
      <Stack.Screen
        name="onboarding"
        options={{ headerShown: false, headerTitle: "Welcome" }}
      />
      <Stack.Screen
        name="welcome"
        options={{ headerShown: false, headerTitle: "Welcome" }}
      />
      <Stack.Screen
        name="sign-in"
        options={{ headerShown: false, headerTitle: "Sign In" }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: true,
          title: "Forgot Your Password?",
          headerBackTitle: "Sign In",
        }}
      />
      <Stack.Screen
        name="otp"
        options={{ headerShown: true, title: "Enter OTP Code!" }}
      />
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
            <TouchableOpacity
              onPressIn={() => router.push("/(auth)/sign-in")}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Text className="text-sm sm:text-base font-ManropeSemibold text-blue">
                Sign In
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="go-pro"
        options={{ headerShown: true, title: "Upgrade to Pro!" }}
      />

      <Stack.Screen
        name="payment-method"
        options={{ headerShown: true, title: "Choose a Payment Option" }}
      />
    </Stack>
  );
};

export default Layout;
