// app/(root)/tabs/clients/_layout.tsx
import { router, Stack, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";

const Layout = () => {
  const { id, clientId } = useLocalSearchParams();
  const idParam = Array.isArray(id) ? id[0] : id;
  const clientIdParam = Array.isArray(clientId) ? clientId[0] : clientId;
  const projectId = idParam ? Number(idParam) : 0;
  const resolvedClientId = clientIdParam ? Number(clientIdParam) : undefined;

  return (
    <Stack
      screenOptions={{
        headerTintColor: "#1C1C1C",
        headerTitleStyle: {
          fontFamily: "Manrope-SemiBold",
        },
        headerStyle: {
          // borderBottomWidth: 0,
          // elevation: 0,
          // shadowOpacity: 0,
        },
        headerShadowVisible: false,
      }}
    >
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
              end={[1, 1]}
            >
              <TouchableOpacity
                onPressIn={() =>
                  router.push({
                    pathname: "/(root)/(tabs)/clients/[id]/notes/add-note",
                    params: { id: projectId, clientId: resolvedClientId },
                  })
                }
                className="w-full h-full rounded-full flex flex-row justify-center items-center"
              >
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
              style={{ borderRadius: 9999 }}
              start={[0, 0]}
              end={[1, 1]}
            >
              <TouchableOpacity
                onPressIn={() =>
                  router.push({
                    pathname:
                      "/(root)/(tabs)/clients/[id]/invoices/add-invoice",
                    params: {
                      id: projectId,
                      clientId: resolvedClientId,
                      mode: "create",
                    },
                  })
                }
                className="w-full h-full rounded-full rounded-red-500 flex flex-row justify-center items-center"
              >
                <Plus size={18} color="#ffffff" />
              </TouchableOpacity>
            </LinearGradient>
            // </WithRole>
          ),
        }}
      />
      <Stack.Screen
        name="invoices/add-invoice"
        options={{
          headerShown: true,
          title: "Add Invoices",
        }}
      />
      <Stack.Screen
        name="brief"
        options={{
          headerShown: true,
          title: "Client Briefing",
        }}
      />
      <Stack.Screen
        name="notes/add-note"
        options={{ headerShown: false, headerTitle: "Notes" }}
      />
      <Stack.Screen
        name="media/images"
        options={{ headerShown: true, title: "Images" }}
      />
      <Stack.Screen
        name="media/videos"
        options={{ headerShown: true, title: "Videos" }}
      />
      <Stack.Screen
        name="media/documents"
        options={{ headerShown: true, title: "Documents" }}
      />
      <Stack.Screen
        name="proposal"
        options={{ headerShown: false, headerTitle: "Perposal" }}
      />
    </Stack>
  );
};

export default Layout;
