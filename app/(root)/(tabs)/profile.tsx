import { CustomButton } from "@/common/components";
import { useAppDispatch } from "@/hooks/redux";
import { logout } from "@/store";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const dispatch = useAppDispatch();
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 justify-end">
        <CustomButton
          onPress={() => {
            dispatch(logout());
          }}
          title="Logout"
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
