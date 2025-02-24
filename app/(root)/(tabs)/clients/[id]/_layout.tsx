// app/(root)/tabs/clients/_layout.tsx
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";
import WithRole from "@/common/components/withRole";

const Layout = () => {
  const { id } = useLocalSearchParams();
  const clientId = parseInt(id);

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
        name="notes/index"
        options={{
          headerShown: true,
          title: "Notes",
          headerRight: () => (
            // <WithRole permission="manage" resource="client" user={user!}>
            <LinearGradient
              colors={["#1B78B9", "#63348F"]}
              className="rounded-full w-8 h-8"
              start={[0, 0]}
              end={[1, 1]}>


              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/clients/[id]/notes/add-note",
                    params: { id: clientId },
                  })
                }
                className="w-full h-full rounded-full flex flex-row justify-center items-center">
                <Plus size={18} color="#ffffff" />
              </TouchableOpacity>
            </LinearGradient>
            // </WithRole>
          ),
        }}
      />
      <Stack.Screen
        name="invoices/index"
        options={{
          headerShown: true,
          title: "Invoices",
          headerRight: () => (
            // <WithRole permission="manage" resource="client" user={user!}>
            <LinearGradient
              colors={["#1B78B9", "#63348F"]}
              className="rounded-full w-8 h-8"
              start={[0, 0]}
              end={[1, 1]}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(root)/clients/[id]/invoices/add-invoice",
                    params: {
                      id: clientId, mode: 'create'
                    },
                  })
                }
                className="w-full h-full rounded-full flex flex-row justify-center items-center">
                <Plus size={18} color="#ffffff" />
              </TouchableOpacity>
            </LinearGradient>
            // </WithRole>
          ),
        }}
      />
      <Stack.Screen name="invoices/add-invoice" options={{
        headerShown: true,
        title: "Add Invoices",
      }} />
      <Stack.Screen name="brief" options={{
        headerShown: true,
        title: "Client Briefing",
      }} />
      <Stack.Screen name="notes/add-note" options={{ headerShown: false, headerTitle: "Notes" }} />
      <Stack.Screen name="media/images" options={{ headerShown: true, title: "Images", }} />
      <Stack.Screen name="media/videos" options={{ headerShown: true, title: "Videos", }} />
      <Stack.Screen name="media/documents" options={{ headerShown: true, title: "Documents", }} />
      <Stack.Screen name="proposal" options={{ headerShown: false, headerTitle: "Perposal" }} />
    </Stack>
  );
};

export default Layout;
