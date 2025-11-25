import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";
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
        name="members"
        options={{
          headerShown: true,
          title: "Members",
          headerRight: () => (
            <WithRole permission="manage" resource="member" user={user!}>
              <LinearGradient
                colors={["#1B78B9", "#63348F"]}
                className="w-8 h-8"
                style={{ borderRadius: 9999 }}
                start={[0, 0]}
                end={[1, 1]}
              >
                <TouchableOpacity
                  onPressIn={() =>
                    router.push("/(root)/(tabs)/members/add-member")
                  }
                  className="w-full h-full rounded-full flex flex-row justify-center items-center"
                >
                  <Plus size={18} color="#ffffff" />
                </TouchableOpacity>
              </LinearGradient>
            </WithRole>
          ),
        }}
      />
      <Stack.Screen
        name="add-member"
        options={{ headerShown: true, title: "Add Member" }}
      />
    </Stack>
  );
};

export default Layout;
