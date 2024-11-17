import { router, Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import React, { useRef, useMemo } from 'react';
import { LinearGradient } from "expo-linear-gradient";
import { Pencil, Plus, Upload } from "lucide-react-native";
import ClientEditModal from "./components/ClientEditModal";
import { BottomSheetModal } from '@gorhom/bottom-sheet';



const Layout = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["49%", "80%"], []);

  // Handle when the user clicks on edit
  const handleEdit = () => {
    // Navigate to the edit client screen (or any other logic)
    router.push("/(root)/(tabs)/clients/edit-client");
  };

  // Handle when the user clicks on delete
  const handleDelete = () => {
    // Logic for deleting the client
    console.log("Deleting client...");
    // You can add your deletion logic here
  };
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
        name="[id]"
        options={{
          headerShown: true,
          title: "Client Detail",
          headerRight: () => (
            <LinearGradient
              colors={["#1B78B9", "#63348F"]}
              className="rounded-full w-8 h-8"
              start={[0, 0]}
              end={[1, 1]}
            >
              <TouchableOpacity
                onPress={() => bottomSheetRef.current?.present()} // Open the modal
                className="w-full h-full rounded-full flex flex-row justify-center items-center"
              >
                <Pencil size={18} color="#ffffff" />
              </TouchableOpacity>
            </LinearGradient>
          ),
        }}
      />

      {/* ClientEditModal for Edit/Delete options */}
      <ClientEditModal
        bottomSheetRef={bottomSheetRef}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Stack.Screen
        name="brief"
        options={{ headerShown: true, title: "Brief" }}
      />
      <Stack.Screen
        name="tasks/[id]"
        options={{
          headerShown: true,
          title: "Tasks",
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
        name="notes"
        options={{
          headerShown: true,
          title: "Notes",
          headerRight: () => (
            <LinearGradient
              colors={["#1B78B9", "#63348F"]}
              className="rounded-full w-8 h-8"
              start={[0, 0]}
              end={[1, 1]}
            >
              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tabs)/clients/create-note")
                }
                className="w-full h-full rounded-full flex flex-row justify-center items-center"
              >
                <Plus size={18} color="#ffffff" />
              </TouchableOpacity>
            </LinearGradient>
          ),
        }}
      />
      <Stack.Screen
        name="create-note"
        options={{
          headerShown: true,
          title: "Create Note",
          headerRight: () => (
            <LinearGradient
              colors={["#1B78B9", "#63348F"]}
              className="rounded-full w-8 h-8"
              start={[0, 0]}
              end={[1, 1]}
            >
              <TouchableOpacity
                onPress={() => { }}
                className="w-full h-full rounded-full flex flex-row justify-center items-center pb-px"
              >
                <Upload size={17} color="#ffffff" />
              </TouchableOpacity>
            </LinearGradient>
          ),
        }}
      />
      <Stack.Screen
        name="notes-detail"
        options={{
          headerShown: true,
          title: "Notes Detail",
        }}
      />
      <Stack.Screen
        name="media-images"
        options={{
          headerShown: true,
          title: "Images",
        }}
      />
      <Stack.Screen
        name="media-videos"
        options={{
          headerShown: true,
          title: "Videos",
        }}
      />
      <Stack.Screen
        name="documents"
        options={{
          headerShown: true,
          title: "Documents",
        }}
      />
    </Stack>
  );
};

export default Layout;