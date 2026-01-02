//app\(root)\(tabs)\Leads\_layout.tsx
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";
import WithRole from "@/common/components/withRole";
import { useAppSelector } from "@/hooks/redux";

const Layout = () => {
  const { user } = useAppSelector((state) => state.auth);

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
        name="clients"
        options={{
          headerShown: true,
          title: "Leads",
          headerRight: () => (
            <WithRole permission="manage" resource="client" user={user!}>
              <LinearGradient
                colors={["#1B78B9", "#63348F"]}
                style={{ borderRadius: 9999, width: 32, height: 32 }}
                start={[0, 0]}
                end={[1, 1]}
              >
                <TouchableOpacity
                  onPressIn={() =>
                    router.push("/(root)/(tabs)/Leads/add-client")
                  }
                  className="flex flex-row justify-center items-center"
                  style={{ width: "100%", height: "100%" }}
                >
                  <Plus size={18} color="#ffffff" />
                </TouchableOpacity>
              </LinearGradient>
            </WithRole>
          ),
        }}
      />
      <Stack.Screen
        name="add-client"
        options={{ headerShown: true, title: "Add Lead" }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
          headerTitle: "Client",
        }}
      />
    </Stack>
  );
};

export default Layout;
