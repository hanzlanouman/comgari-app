//app\(root)\(tabs)\clients\_layout.tsx
import { router, Stack , useLocalSearchParams} from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import React from 'react';
import { LinearGradient } from "expo-linear-gradient";
import { Pencil, Plus, Upload } from "lucide-react-native";
const { id } = useLocalSearchParams();
const clientId = parseInt(id);

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
      <Stack.Screen
        name="clients"
        options={{
          headerShown: true,
          title: "Clients",
          headerRight: () => (
            <LinearGradient
              colors={["#1B78B9", "#63348F"]}
              className="rounded-full w-8 h-8"
              start={[0, 0]}
              end={[1, 1]}
            >
              <TouchableOpacity
                onPress={() => router.push("/(root)/(tabs)/clients/add-client")}
                className="w-full h-full rounded-full flex flex-row justify-center items-center"
              >
                <Plus size={18} color="#ffffff" />
              </TouchableOpacity>
            </LinearGradient>
          ),
        }}
      />
      <Stack.Screen
        name="add-client"
        options={{ headerShown: true, title: "Add Client" }}
      />
      <Stack.Screen
        name="[id]/notes/index"
        options={{ headerShown: true, title: "Notes"   ,headerRight: () => (
          <LinearGradient
            colors={["#1B78B9", "#63348F"]}
            className="rounded-full w-8 h-8"
            start={[0, 0]}
            end={[1, 1]}
          >
            <TouchableOpacity
              onPress={() => router.push({
                pathname: "/clients/[id]/notes/add-note",
                params: { id: clientId }
              })} 
              className="w-full h-full rounded-full flex flex-row justify-center items-center"
            >
              <Plus size={18} color="#ffffff" />
            </TouchableOpacity>
          </LinearGradient>
        ),}}
      />
      <Stack.Screen
        name="[id]/notes/add-note"
        options={{ headerShown: true, title: "Add Note" }}
      />
    </Stack>

  );
};

export default Layout;