import { router, Stack } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Pencil, Plus, Upload } from "lucide-react-native";

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
        name="client-detail"
        options={{ headerShown: true, title: "Client Detail" }}
      />
      <Stack.Screen
        name="brief"
        options={{ headerShown: true, title: "Brief" }}
      />
      <Stack.Screen
        name="tasks"
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
                onPress={() => {}}
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
    </Stack>
  );
};

export default Layout;
