import { router, Stack, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Plus } from "lucide-react-native";

const Layout = () => {
  const params = useLocalSearchParams();

  const goBack = () => {
    const canGoBack = router.canGoBack();
    if (canGoBack) {
      router.back();
      return;
    }
    if (params?.clientId || params?.id) {
      router.replace(`/(root)/(tabs)/clients/${params?.clientId || params?.id}`);
      return;
    }
    router.replace("/(root)/(tabs)/clients/");
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
        headerShown: true,
      }}>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          headerTitleAlign: "center",
          title: "Proposal",
          headerLeft: () => (
            <TouchableOpacity onPress={goBack}>
              <ArrowLeft size={24} color="#1C1C1C" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <LinearGradient
              colors={["#1B78B9", "#63348F"]}
              className="rounded-full w-8 h-8"
              start={[0, 0]}
              end={[1, 1]}>
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    "/(root)/(tabs)/clients/[id]/proposal/job-details"
                  )
                }
                className="w-full h-full rounded-full flex flex-row justify-center items-center">
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
          title: "Proposal Details",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
              <ArrowLeft size={24} color="#1C1C1C" />
            </TouchableOpacity>
          )
        }}
      />
      <Stack.Screen
        name="add-proposal"
        options={{
          headerShown: true,
          title: "Add Proposal",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{}}>
              <ArrowLeft size={24} color="#1C1C1C" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
        }}
      />
      {/* <Stack.Screen
        name="job-details"
        options={{
          headerShown: true,
          title: "Job Details",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{}}>
              <ArrowLeft size={24} color="#1C1C1C" />
            </TouchableOpacity>
          ),
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="specifications"
        options={{ headerShown: true, title: "Specifications" }}
      />
      <Stack.Screen
        name="review"
        options={{ headerShown: true, title: "Review" }}
      /> */}
    </Stack>
  );
};

export default Layout;
