import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";

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
        name="proposal"
        options={{
          headerShown: true,
          title: "Proposal",
          headerRight: () => (
            <LinearGradient
              colors={["#1B78B9", "#63348F"]}
              className="rounded-full w-8 h-8"
              start={[0, 0]}
              end={[1, 1]}
            >
              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tabs)/proposal/job-details")
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
        name="proposal-detail"
        options={{
          headerShown: true,
          title: "Proposal Detail",
          headerRight: () => (
            <LinearGradient
              colors={["#1B78B9", "#63348F"]}
              className="rounded-full w-8 h-8"
              start={[0, 0]}
              end={[1, 1]}
            >
              <TouchableOpacity
                onPress={() =>
                  router.push("/(root)/(tabs)/proposal/proposal-detail")
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
        name="job-details"
        options={{ headerShown: true, title: "Job Details" }}
      />
      <Stack.Screen
        name="specifications"
        options={{ headerShown: true, title: "Specifications" }}
      />
      <Stack.Screen
        name="review"
        options={{ headerShown: true, title: "Review" }}
      />
    </Stack>
  );
};

export default Layout;
