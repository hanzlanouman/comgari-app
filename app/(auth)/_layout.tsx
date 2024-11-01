/* eslint-disable prettier/prettier */
import { TouchableOpacity, Text } from "react-native";
import { Href, Redirect, router, Stack } from "expo-router";
import "react-native-reanimated";
import { useAppSelector } from "@/hooks/redux";
import { route } from "@/common";

const Layout = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  if (isAuthenticated) {
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
        options={{ headerShown: true, title: "", headerBackTitle: "Sign In" }}
      />
      <Stack.Screen name="otp" options={{ headerShown: true, title: "" }} />
      <Stack.Screen
        name="reset-password"
        options={{ headerShown: true, title: "" }}
      />
      <Stack.Screen
        name="sign-up"
        options={{
          headerShown: true,
          title: "Create Account",
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
    </Stack>
  );
};

export default Layout;
